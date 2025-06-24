import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
  Container,
  Slide,
  Paper,
  Stack,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search,
  Add,
  Brightness4,
  Brightness7,
  Home as HomeIcon,
  Explore as ExploreIcon,
  Info as InfoIcon,
  ContactMail as ContactIcon,
  AccountCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { useThemeMode } from '../../../context/ThemeContext';

// Award-winning glassmorphic nav style
const glassNavStyle = (theme) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(26,34,63,0.85)'
    : 'rgba(255,255,255,0.85)',
  boxShadow: '0 8px 32px 0 rgba(58, 134, 255, 0.12)',
  backdropFilter: 'blur(18px) saturate(180%)',
  borderRadius: '0 0 32px 32px',
  borderBottom: '1.5px solid rgba(255,255,255,0.18)',
  transition: 'background 0.3s'
});

const navLinks = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Explore', path: '/explore', icon: <ExploreIcon /> },
  { label: 'About', path: '/about', icon: <InfoIcon /> },
  { label: 'Contact', path: '/contact', icon: <ContactIcon /> }
];

const HomeTopNavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const profile = useUser();
  const { mode, toggleTheme } = useThemeMode();

  // Avatar logic
  let avatarSrc = undefined;
  if (profile?.userType === 'admin') {
    avatarSrc = '/images/admin.png';
  } else if (profile?.profilePicture) {
    avatarSrc = `${import.meta.env.VITE_API_URL}${profile.profilePicture}`;
  }

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMobileMenuOpen = (event) => setMobileMenuAnchor(event.currentTarget);
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleDashboard = () => {
    if (profile?.userType === 'admin') navigate('/admin');
    else if (profile?.userType === 'user') navigate('/user');
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.reload();
  };

  // Award-level logo with gradient
  const Logo = (
    <Typography
      variant="h4"
      component="div"
      sx={{
        flexGrow: 0,
        mr: 4,
        fontWeight: 900,
        letterSpacing: '-1.5px',
        cursor: 'pointer',
        background: theme.palette.gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif'
      }}
      onClick={() => navigate('/')}
    >
      CrowdFundNext
    </Typography>
  );

  return (
    <Slide appear in direction="down">
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          ...glassNavStyle(theme),
          color: theme.palette.text.primary,
          zIndex: (theme) => theme.zIndex.drawer + 2,
          minHeight: 72,
        }}
      >
        <Container maxWidth="lg" disableGutters>
          <Toolbar sx={{ minHeight: 72, px: { xs: 1, sm: 2 } }}>
            {/* Logo */}
            {Logo}

            {/* Desktop Navigation */}
            {!isMobile && (
              <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                {navLinks.map((item) => (
                  <Button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    startIcon={item.icon}
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: theme.palette.text.primary,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      background: 'transparent',
                      transition: 'background 0.2s, color 0.2s',
                      '&:hover': {
                        background: theme.palette.mode === 'dark'
                          ? 'rgba(58,134,255,0.08)'
                          : 'rgba(58,134,255,0.10)',
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            )}

            {/* Mobile Navigation */}
            {isMobile && (
              <Box sx={{ flexGrow: 1 }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMobileMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}

            {/* Right side buttons */}
            <Stack direction="row" spacing={1} alignItems="center">



              {/* User Avatar/Profile */}
              {profile ? (
                <>
                  <Tooltip title="Account">
                    <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                      <Avatar
                        alt={profile?.firstName || profile?.email}
                        src={avatarSrc}
                        sx={{
                          width: 44,
                          height: 44,
                          bgcolor: 'rgba(58,134,255,0.12)',
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                          fontSize: '1.2rem'
                        }}
                      >
                        {profile?.firstName ? profile.firstName[0] : (profile?.email ? profile.email[0] : <AccountCircle />)}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        ...glassNavStyle(theme),
                        mt: 1.5,
                        minWidth: 180,
                        boxShadow: '0 8px 32px 0 #3a86ff22'
                      }
                    }}
                  >
                    <MenuItem onClick={() => { handleMenuClose(); handleDashboard(); }}>
                      Dashboard
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>

              ) : (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/register')}
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                      borderRadius: 3,
                      px: 2.5,
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        background: 'rgba(58,134,255,0.08)'
                      }
                    }}
                  >
                    Register
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                      borderRadius: 3,
                      px: 2.5,
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        background: 'rgba(58,134,255,0.08)'
                      }
                    }}
                  >
                    Login
                  </Button>
                </>

              )
              }
              <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
                <IconButton onClick={toggleTheme} color="inherit">
                  {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Tooltip>
            </Stack>

            {/* Mobile Menu */}
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  ...glassNavStyle(theme),
                  mt: 1.5,
                  minWidth: 180,
                  boxShadow: '0 8px 32px 0 #3a86ff22'
                }
              }}
            >
              {navLinks.map((item) => (
                <MenuItem
                  key={item.label}
                  onClick={() => {
                    handleMenuClose();
                    navigate(item.path);
                  }}
                  sx={{ fontWeight: 600, fontSize: '1.1rem' }}
                >
                  {item.icon}
                  <Box sx={{ ml: 1 }}>{item.label}</Box>
                </MenuItem>
              ))}
              <Divider />
              {profile ? (
                [
                  <MenuItem key="dashboard" onClick={() => { handleMenuClose(); handleDashboard(); }}>
                    Dashboard
                  </MenuItem>,
                  <MenuItem key="logout" onClick={handleLogout}>
                    Logout
                  </MenuItem>
                ]
              ) : (
                [
                  <MenuItem key="register" onClick={() => { handleMenuClose(); navigate('/register'); }}>
                    Register
                  </MenuItem>,
                  <MenuItem key="login" onClick={() => { handleMenuClose(); navigate('/login'); }}>
                    Login
                  </MenuItem>
                ]
              )}
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
};

export default HomeTopNavBar;