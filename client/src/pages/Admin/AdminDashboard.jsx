import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, useTheme, Fade, CircularProgress, Alert } from '@mui/material';
import { People, CheckCircle, HourglassEmpty, MonetizationOn } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Glassmorphic + 3D glow style (matches Register/Login/UserPostCampaign)
const glass3DGlowStyle = (theme) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(26,34,63,0.92)'
    : 'rgba(255,255,255,0.92)',
  boxShadow: `
    0 8px 32px 0 rgba(58,134,255,0.10),
    0 1.5px 8px 0 rgba(26,34,63,0.10),
    0 2px 24px 0 rgba(58,134,255,0.10),
    0 0.5px 1.5px 0 rgba(255,255,255,0.18) inset,
    0 0 32px 8px #3a86ff44,
    0 24px 48px 0 #1a223f11
  `,
  backdropFilter: 'blur(18px) saturate(180%)',
  borderRadius: '32px',
  border: '1.5px solid rgba(255,255,255,0.13)',
  overflow: 'hidden',
  position: 'relative',
  transform: 'translateZ(0)',
  transition: 'box-shadow 0.3s'
});

// Animated glassy 3D glow blobs (blue/mint, not rainbow)
const AnimatedBg = () => {
  const theme = useTheme();
  return (
    <>
      <motion.div
        initial={{ scale: 0.95, opacity: 0.5 }}
        animate={{ scale: [0.95, 1.05, 0.98, 1], opacity: [0.5, 0.7, 0.6, 0.5] }}
        transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-120px',
          left: '-120px',
          width: 320,
          height: 320,
          zIndex: 0,
          filter: 'blur(80px)',
          borderRadius: '50%',
          boxShadow: '0 0 64px 16px #3a86ff33',
          opacity: 0.7,
        }}
      />
      <motion.div
        initial={{ scale: 1, opacity: 0.3 }}
        animate={{ scale: [1, 1.08, 0.98, 1], opacity: [0.3, 0.6, 0.4, 0.3] }}
        transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '-80px',
          right: '-80px',
          width: 220,
          height: 220,
          zIndex: 0,
          background: 'radial-gradient(circle at 40% 60%, #1a223f33 0%, #3a86ff55 100%)',
          filter: 'blur(60px)',
          borderRadius: '50%',
          boxShadow: '0 0 32px 8px #36f1cd33',
          opacity: 0.5,
        }}
      />
    </>
  );
};

const AdminDashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('jwt');
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Failed to fetch stats');
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats ? [
    {
      label: 'Active Posts',
      value: stats.activeCampaigns,
      icon: <CheckCircle sx={{ fontSize: 44, color: theme.palette.success.main }} />,
      color: theme.palette.success.light,
    },
    {
      label: 'Posts Awaiting Approval',
      value: stats.pendingCampaigns,
      icon: <HourglassEmpty sx={{ fontSize: 44, color: theme.palette.warning.main }} />,
      color: theme.palette.warning.light,
    },
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: <People sx={{ fontSize: 44, color: theme.palette.primary.main }} />,
      color: theme.palette.primary.light,
    },
    {
      label: 'Total Funds Raised',
      value: stats.totalFundsRaised,
      icon: <MonetizationOn sx={{ fontSize: 44, color: theme.palette.accent ? theme.palette.accent.main : '#ff4d6d' }} />,
      color: theme.palette.accent ? theme.palette.accent.light : '#ff4d6d22',
      money: true,
    },
  ] : [];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        px: { xs: 1, md: 4 },
        pt: { xs: 6, md: 10 },
        pb: { xs: 4, md: 8 },
        display: 'block',
      }}
    >
      <AnimatedBg />
      <Fade in timeout={900}>
        <Box
          sx={{
            ...glass3DGlowStyle(theme),
            maxWidth: 1100,
            width: '100%',
            mx: 'auto',
            p: { xs: 3, md: 6 },
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 12px 48px 0 rgba(58,134,255,0.18)',
          }}
        >
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{ mb: 5, letterSpacing: '-1.2px', textAlign: 'center', background: theme.palette.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Admin Dashboard
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={5} justifyContent="center">
              {statCards.map((stat, i) => (
                <Grid item xs={12} sm={6} md={3} key={stat.label}>
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 + i * 0.2, ease: 'easeOut' }}
                    elevation={0}
                    sx={{
                      ...glass3DGlowStyle(theme),
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      minHeight: 180,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(26,34,63,0.85)'
                        : 'rgba(255,255,255,0.85)',
                      boxShadow: '0 8px 32px 0 #3a86ff22',
                      transition: 'box-shadow 0.3s, transform 0.2s',
                      '&:hover': {
                        boxShadow: '0 16px 48px 0 #3a86ff44',
                        transform: 'scale(1.04)'
                      }
                    }}
                  >
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 0 }}>
                      {stat.icon}
                      <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, mt: 1 }}>
                        {stat.money ? `$${stat.value.toLocaleString()}` : stat.value}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default AdminDashboard; 