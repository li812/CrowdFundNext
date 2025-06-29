import React from 'react';
import {
  Container, Box, Paper, Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HomeTopNavBar from '../../components/NavBar/HomeTopNavBar/HomeTopNavBar';
import { Outlet } from 'react-router-dom';

// Glassmorphic + 3D glow style
const glass3DGlowStyle = (theme) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(26,34,63,0.92)'
    : 'rgba(255,255,255,0.92)',
  boxShadow: `
    0 8px 32px 0 rgba(58,134,255,0.10),
    0 1.5px 8px 0 rgba(26,34,63,0.10),
    0 2px 24px 0 rgba(58,134,255,0.10),
    0 0.5px 1.5px 0 rgba(255,255,255,0.18) inset,
    0 0 32px 8px #3a86ff44
  `,
  backdropFilter: 'blur(18px) saturate(180%)',
  borderRadius: '32px',
  border: '1.5px solid rgba(255,255,255,0.13)',
  overflow: 'hidden',
  position: 'relative',
  transition: 'box-shadow 0.3s'
});

const HomeBase = () => {
  const theme = useTheme();

  return (
    <Box sx={{
      minHeight: '100vh',
      background: theme.palette.mode === 'dark'
        ? 'radial-gradient(ellipse at 60% 40%, #3a86ff44 0%, #1a223f 100%)'
        : 'radial-gradient(ellipse at 60% 40%, #36f1cd44 0%, #f4f6fb 100%)',
      overflowX: 'hidden'
    }}>
      <HomeTopNavBar />
      
      {/* Main Content */}
      <Container 
        maxWidth="xxlg" 
        sx={{ py: 1, mt: { xs: 1, sm: 11 } }}
        style={{
          background: 'rgba(255, 255, 255, 0)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(58, 134, 255, 0.18)',
          backdropFilter: 'blur(18px) saturate(180%)',
          border: '1.5px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <Outlet />
      </Container>

      {/* Simple Footer */}
      <Box sx={{ 
        mt: 4, 
        mb: 2,
        position: 'relative'
      }}>
        <Container maxWidth="xxlg">
          <Paper
            elevation={0}
            sx={{
              ...glass3DGlowStyle(theme),
              p: { xs: 2, md: 3 },
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              © 2025 CrowdFundNext. All rights reserved.
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Empowering dreams through community support
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default HomeBase;