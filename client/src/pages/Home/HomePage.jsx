import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, useTheme } from '@mui/material';
import { TrendingUp, Security, People, Favorite } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Glassmorphic & liquid helpers
const glassStyle = (theme) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(26,34,63,0.65)'
    : 'rgba(255,255,255,0.45)',
  boxShadow: '0 8px 32px 0 rgba(58, 134, 255, 0.18)',
  backdropFilter: 'blur(18px) saturate(180%)',
  borderRadius: '32px',
  border: '1.5px solid rgba(255,255,255,0.18)',
  overflow: 'hidden',
  position: 'relative'
});
const liquidBg = (theme) =>
  theme.palette.mode === 'dark'
    ? 'radial-gradient(ellipse at 60% 40%, #3a86ff33 0%, #1a223f 100%)'
    : 'radial-gradient(ellipse at 60% 40%, #36f1cd33 0%, #f4f6fb 100%)';

const heroGradient = (theme) =>
  theme.palette.mode === 'dark'
    ? 'linear-gradient(120deg, #3a86ff 0%, #36f1cd 40%, #ffe066 70%, #ff4d6d 100%)'
    : 'linear-gradient(120deg, #3a86ff 0%, #36f1cd 40%, #ffe066 70%, #ff4d6d 100%)';

const HomePage = () => {
  const theme = useTheme();

  // Animation variants
  const heroVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: 'easeOut' } }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + i * 0.15, duration: 0.8, type: 'spring', stiffness: 120 }
    })
  };

  const features = [
    {
      icon: <TrendingUp sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Instant Campaigns',
      description: 'Launch your project in seconds with our ultra-fast, intuitive setup.'
    },
    {
      icon: <Security sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      title: 'Bank-Grade Security',
      description: 'Your funds and data are protected with industry-leading encryption.'
    },
    {
      icon: <People sx={{ fontSize: 48, color: theme.palette.accent.main }} />,
      title: 'Vibrant Community',
      description: 'Connect, collaborate, and grow with a global network of changemakers.'
    },
    {
      icon: <Favorite sx={{ fontSize: 48, color: theme.palette.warning.main }} />,
      title: 'Recurring Support',
      description: 'Enable monthly donations and build lasting impact for your cause.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'rgba(0,0,0,0)', pb: 8, overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        component={motion.section}
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        sx={{
          ...glassStyle(theme),
          mt: { xs: 10, md: 14 },
          mx: 'auto',
          maxWidth: 1100,
          py: { xs: 8, md: 14 },
          px: { xs: 2, md: 10 },
          textAlign: 'center',
          mb: 10,
          position: 'relative',
        }}
      >
        {/* Liquid Glass Animated Blobs */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0.7 }}
          animate={{ scale: [0.95, 1.1, 0.98, 1], opacity: [0.7, 1, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-120px',
            left: '-120px',
            width: 420,
            height: 420,
            zIndex: 0,
            background: 'radial-gradient(circle at 60% 40%, #3a86ff88 0%, #36f1cdcc 100%)',
            filter: 'blur(90px)',
            borderRadius: '50%',
            opacity: 0.7,
          }}
        />
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: [1, 1.12, 0.98, 1], opacity: [0.5, 0.8, 0.7, 0.5] }}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut', delay: 2 }}
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: 340,
            height: 340,
            zIndex: 0,
            background: 'radial-gradient(circle at 40% 60%, #ff4d6d88 0%, #ffe066cc 100%)',
            filter: 'blur(80px)',
            borderRadius: '50%',
            opacity: 0.6,
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h1"
            component={motion.h1}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.1 }}
            fontWeight="bold"
            sx={{
              background: heroGradient(theme),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.8rem', md: '4.5rem' },
              mb: 2,
              letterSpacing: '-2px',
              lineHeight: 1.1,
              textShadow: '0 2px 24px #36f1cd33'
            }}
          >
            The Future of Crowdfunding is <br />
            <Box component="span" sx={{ fontWeight: 900, background: 'linear-gradient(90deg, #ff4d6d, #3a86ff 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Liquid & Limitless
            </Box>
          </Typography>
          <Typography
            variant="h5"
            component={motion.p}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.1 }}
            sx={{
              mb: 5,
              color: theme.palette.text.secondary,
              fontWeight: 500,
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              letterSpacing: '0.5px'
            }}
          >
            Empower your ideas, projects, and dreams with the world’s most advanced, student-friendly crowdfunding platform.
          </Typography>
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1.1 }}
            sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: theme.palette.accent.main,
                color: theme.palette.getContrastText(theme.palette.accent.main),
                px: 5,
                py: 1.7,
                fontSize: '1.2rem',
                borderRadius: 12,
                boxShadow: '0 4px 32px 0 #ff4d6d44',
                fontWeight: 700,
                letterSpacing: 1,
                transition: 'transform 0.2s',
                '&:hover': {
                  bgcolor: theme.palette.accent.dark || '#d13a54',
                  transform: 'scale(1.06)',
                  boxShadow: '0 8px 40px 0 #ff4d6d66',
                },
              }}
            >
              Start Your Campaign
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                px: 5,
                py: 1.7,
                fontSize: '1.2rem',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                fontWeight: 700,
                letterSpacing: 1,
                transition: 'transform 0.2s',
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  background: 'rgba(58,134,255,0.10)',
                  transform: 'scale(1.06)',
                },
              }}
            >
              Explore Campaigns
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h3"
          component={motion.h2}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          textAlign="center"
          gutterBottom
          fontWeight="bold"
          sx={{
            background: heroGradient(theme),
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '2rem', md: '2.8rem' },
            mb: 2,
            letterSpacing: '-1px'
          }}
        >
          Why CrowdFundNext?
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 8, fontWeight: 400 }}
        >
          Everything you need to launch, fund, and grow your next big idea.
        </Typography>
        <Grid container spacing={5}>
          {features.map((feature, i) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Card
                component={motion.div}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={featureVariants}
                sx={{
                  ...glassStyle(theme),
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  minHeight: 260,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: 'none',
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(26,34,63,0.85)'
                    : 'rgba(255,255,255,0.85)',
                  boxShadow: '0 8px 32px 0 #3a86ff22',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: '0 16px 48px 0 #3a86ff44',
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Section */}
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1 }}
          sx={{
            ...glassStyle(theme),
            px: { xs: 2, md: 6 },
            py: { xs: 4, md: 6 },
            textAlign: 'center',
            background: theme.palette.mode === 'dark'
              ? 'rgba(26,34,63,0.92)'
              : 'rgba(255,255,255,0.92)',
            boxShadow: '0 8px 32px 0 #36f1cd22',
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            What is CrowdFunding?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Crowdfunding is a way to raise money for a project, cause, or idea by collecting small contributions from a large number of people, typically via the internet. It empowers anyone to turn their dreams into reality with the support of a global community.
          </Typography>
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 1 }}>
            Types of Crowdfunding
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <b>Donation-based:</b> Supporters donate without expecting anything in return.<br />
            <b>Reward-based:</b> Backers receive a reward or product.<br />
            <b>Equity-based:</b> Contributors get shares in the project.<br />
            <b>Debt-based:</b> Supporters lend money and are repaid with interest.
          </Typography>
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1 }}
        sx={{
          ...glassStyle(theme),
          bgcolor: 'rgba(255,255,255,0.10)',
          py: 8,
          textAlign: 'center',
          mx: 'auto',
          maxWidth: 700,
          background: theme.palette.mode === 'dark'
            ? 'rgba(26,34,63,0.92)'
            : 'rgba(255,255,255,0.92)',
          boxShadow: '0 8px 32px 0 #ff4d6d22',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of creators who have successfully funded their dreams
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.getContrastText(theme.palette.primary.main),
              px: 5,
              py: 1.7,
              fontSize: '1.2rem',
              borderRadius: 12,
              boxShadow: '0 4px 24px 0 #3a86ff44',
              fontWeight: 700,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
                boxShadow: '0 8px 32px 0 #3a86ff88',
                transform: 'scale(1.06)',
              },
            }}
          >
            Create Your First Campaign
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;