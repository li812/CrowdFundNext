import React from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Avatar, Box, InputBase,
  Menu, MenuItem, Container, Paper
} from '@mui/material';
import { Home, Settings, Logout, Search, Brightness4, Brightness7 } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useTheme } from '@mui/material/styles';
import { useThemeMode } from '../../context/ThemeContext'; // <-- FIXED

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

function UserBase() {
  const user = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Add theme mode context
  const { mode, toggleTheme } = useThemeMode();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userType');
    window.location.href = '/';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: theme.palette.mode === 'dark'
        ? 'radial-gradient(ellipse at 60% 40%, #3a86ff44 0%, #1a223f 100%)'
        : 'radial-gradient(ellipse at 60% 40%, #36f1cd44 0%, #f4f6fb 100%)',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Fixed AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          ...glass3DGlowStyle(theme),
          top: 0,
          left: 0,
          right: 0,
          height: { xs: 64, md: 72 },
          borderRadius: '0 0 32px 32px',
          boxShadow: '0 8px 32px 0 #3a86ff22',
          bgcolor: 'transparent',
          zIndex: 1300
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mr: 3,
              cursor: 'pointer',
              background: 'linear-gradient(90deg, #3a86ff, #36f1cd, #ffe066, #ff4d6d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1.5px'
            }}
            onClick={() => navigate('/user')}
          >
            CrowdFundNext
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 2 }}>
            <IconButton
              color="primary"
              size="large"
              onClick={() => navigate('/user')}
              sx={{
                bgcolor: theme.palette.accent.main,
                color: theme.palette.getContrastText(theme.palette.accent.main),
                borderRadius: 3,
                px: 2.5,
                py: 1.2,
                ml: 1,
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 2px 12px 0 #ff4d6d22',
                '&:hover': {
                  bgcolor: theme.palette.accent.dark || '#d13a54',
                  color: theme.palette.getContrastText(theme.palette.accent.dark || '#fff'),
                  boxShadow: '0 4px 24px 0 #ff4d6d44',
                }
              }}
            >
              Home
            </IconButton>
            <IconButton
              color="primary"
              size="large"
              onClick={() => navigate('/user')}
              sx={{
                bgcolor: theme.palette.accent.main,
                color: theme.palette.getContrastText(theme.palette.accent.main),
                borderRadius: 3,
                px: 2.5,
                py: 1.2,
                ml: 1,
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 2px 12px 0 #ff4d6d22',
                '&:hover': {
                  bgcolor: theme.palette.accent.dark || '#d13a54',
                  color: theme.palette.getContrastText(theme.palette.accent.dark || '#fff'),
                  boxShadow: '0 4px 24px 0 #ff4d6d44',
                }
              }}
            >
              Explore
            </IconButton>
          </Box>

          {/* Search Bar */}
          <Box sx={{
            flexGrow: 1,
            maxWidth: 400,
            display: 'flex',
            alignItems: 'center',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(26,34,63,0.65)' : 'rgba(255,255,255,0.65)',
            borderRadius: 2,
            px: 2,
            mr: 3,
            boxShadow: '0 2px 8px 0 #3a86ff11'
          }}>
            <Search sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <InputBase
              placeholder="Search campaigns, people..."
              sx={{ flex: 1, color: theme.palette.text.primary, fontWeight: 500 }}
            />
          </Box>

          {/* Start a Campaign Button */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 2 }}>
            <IconButton
              color="primary"
              size="large"
              onClick={() => navigate('/user/post-campaign')}
              sx={{
                bgcolor: theme.palette.accent.main,
                color: theme.palette.getContrastText(theme.palette.accent.main),
                borderRadius: 3,
                px: 2.5,
                py: 1.2,
                ml : 1,
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 2px 12px 0 #ff4d6d22',
                '&:hover': {
                  bgcolor: theme.palette.accent.dark || '#d13a54',
                  color: theme.palette.getContrastText(theme.palette.accent.dark || '#fff'),
                  boxShadow: '0 4px 24px 0 #ff4d6d44',
                }
              }}
            >
              My Campaigns
            </IconButton>
            <IconButton
              color="primary"
              size="large"
              onClick={() => navigate('/user/post-campaign')}
              sx={{
                bgcolor: theme.palette.accent.main,
                color: theme.palette.getContrastText(theme.palette.accent.main),
                borderRadius: 3,
                px: 2.5,
                py: 1.2,  
                ml: 1,
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 2px 12px 0 #ff4d6d22',
                '&:hover': {
                  bgcolor: theme.palette.accent.dark || '#d13a54',
                  color: theme.palette.getContrastText(theme.palette.accent.dark || '#fff'),
                  boxShadow: '0 4px 24px 0 #ff4d6d44',
                }
              }}
            >
              Start a Campaign
            </IconButton>
          </Box>

          {/* Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user && (
              <Typography
                variant="body1"
                sx={{
                  mr: 2,
                  fontWeight: 500,
                  color: theme.palette.text.primary // <-- This line makes it adapt to theme
                }}
              >
                {user.firstName} {user.lastName}
              </Typography>
            )}
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                alt={user?.firstName || user?.email}
                src={user?.profilePicture ? `${import.meta.env.VITE_API_URL}${user.profilePicture}` : undefined}
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: '#ff6b6b',
                  color: 'white',
                  boxShadow: '0 2px 8px 0 #ff4d6d33'
                }}
              >
                {user?.firstName?.[0] || user?.email?.[0] || ''}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={() => { handleMenuClose(); navigate('/user'); }}>
                <Home sx={{ mr: 1 }} /> Home
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); navigate('/user/settings'); }}>
                <Settings sx={{ mr: 1 }} /> Settings
              </MenuItem>
              {/* Theme toggle */}
              <MenuItem
                onClick={() => { toggleTheme(); handleMenuClose(); }}
              >
                {theme.palette.mode === 'dark' ? (
                  <Brightness7 sx={{ mr: 1 }} />
                ) : (
                  <Brightness4 sx={{ mr: 1 }} />
                )}
                {theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content Below Fixed AppBar */}
      <Container>
        <Outlet />
      </Container>
    </Box>
  );
}

export default UserBase;
