import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Container,
  InputBase,
  Tooltip,
  Divider,
  Button
} from '@mui/material';
import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  AddCircleOutline,
  Campaign,
  Settings,
  Logout,
  Brightness4,
  Brightness7,
  Search
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { useThemeMode } from '../../../context/ThemeContext';
import { useTheme } from '@mui/material/styles';

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
  { label: 'Home', path: '/user', icon: <HomeIcon /> }
];

const campaignLinks = [
  { label: 'My Campaigns', path: '/user/campaigns', icon: <Campaign /> },
  { label: 'Start a Campaign', path: '/user/post-campaign', icon: <AddCircleOutline /> }
];

const UserTopNavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUser();
  const { mode, toggleTheme } = useThemeMode();

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userType');
    window.location.href = '/';
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        ...glassNavStyle(theme),
        color: theme.palette.text.primary,
        zIndex: (theme) => theme.zIndex.drawer + 2,
        minHeight: 72,
        top: 0,
        left: 0,
        right: 0
      }}
    >
      <Container maxWidth="xxlg" disableGutters>
        <Toolbar sx={{ minHeight: 92, px: { xs: 1, sm: 2 }, display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo */}
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
            onClick={() => navigate('/user')}
          >
            CrowdFundNext
          </Typography>

          {/* Navigation Links (left) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, flexGrow: 1 }}>
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/user' && location.pathname.startsWith(item.path));
              return (
                <IconButton
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                    borderRadius: 2,
                    background: isActive
                      ? (theme.palette.mode === 'dark'
                          ? 'rgba(58,134,255,0.13)'
                          : 'rgba(58,134,255,0.10)')
                      : 'transparent',
                    boxShadow: isActive ? '0 2px 12px 0 #3a86ff22' : 'none',
                    transition: 'background 0.2s, color 0.2s',
                    '&:hover': {
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(58,134,255,0.18)'
                        : 'rgba(58,134,255,0.15)',
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  {item.icon}
                  <Typography variant="body1" sx={{ ml: 1, fontWeight: 700 }}>{item.label}</Typography>
                </IconButton>
              );
            })}
          </Box>



          {/* Campaign Buttons (right of search, left of name/avatar) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center', mr: 2 }}>
            {campaignLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  variant={isActive ? 'contained' : 'outlined'}
                  color={isActive ? 'primary' : 'inherit'}
                  sx={{
                    fontWeight: 700,
                    borderRadius: 3,
                    px: 2.5,
                    py: 1.2,
                    fontSize: '1rem',
                    boxShadow: isActive ? '0 2px 12px 0 #3a86ff22' : 'none',
                    background: isActive ? theme.palette.primary.main : 'transparent',
                    color: isActive ? theme.palette.getContrastText(theme.palette.primary.main) : theme.palette.text.primary,
                    borderColor: theme.palette.primary.main,
                    '&:hover': {
                      background: isActive ? theme.palette.primary.dark : 'rgba(58,134,255,0.08)',
                      color: theme.palette.getContrastText(theme.palette.primary.main)
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* Avatar/Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user && (
              <Typography
                variant="body1"
                sx={{
                  mr: 2,
                  fontWeight: 500,
                  color: theme.palette.text.primary
                }}
              >
                {user.firstName} {user.lastName}
              </Typography>
            )}
            <Tooltip title="Account">
              <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  alt={user?.firstName || user?.email}
                  src={user?.profilePicture ? `${import.meta.env.VITE_API_URL}${user.profilePicture}` : undefined}
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: '#ff6b6b',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    boxShadow: '0 2px 8px 0 #ff4d6d33'
                  }}
                >
                  {user?.firstName?.[0] || user?.email?.[0] || ''}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={() => { handleMenuClose(); navigate('/user/settings'); }}>
                <Settings sx={{ mr: 1 }} /> Settings
              </MenuItem>
              <MenuItem onClick={() => { toggleTheme(); handleMenuClose(); }}>
                {theme.palette.mode === 'dark' ? (
                  <Brightness7 sx={{ mr: 1 }} />
                ) : (
                  <Brightness4 sx={{ mr: 1 }} />
                )}
                {theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default UserTopNavBar; 