import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Divider,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Brightness4,
  Brightness7,
  People as PeopleIcon,
  DoneAll as DoneAllIcon
} from '@mui/icons-material';
import PaidIcon from '@mui/icons-material/Paid';
import { useTheme } from '@mui/material/styles';
import { useThemeMode } from '../../context/ThemeContext';

const drawerWidth = 240;

const adminMenu = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { label: 'Manage Users', icon: <PeopleIcon />, path: '/admin/manage-users' },
  { label: 'Manage Campaigns', icon: <DoneAllIcon />, path: '/admin/manage-campaigns' },
  { label: 'Manage Transactions', icon: <PaidIcon />, path: '/admin/manage-transactions' }
];

function getUserFromJWT() {
  const token = localStorage.getItem('jwt');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };
  } catch {
    return null;
  }
}

const glassyAppBar = (theme) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(26,34,63,0.85)'
    : 'rgba(255,255,255,0.85)',
  boxShadow: '0 8px 32px 0 rgba(58, 134, 255, 0.12)',
  backdropFilter: 'blur(18px) saturate(180%)',
  borderBottom: '1.5px solid rgba(255,255,255,0.18)',
  transition: 'background 0.3s',
});

const glassyDrawer = (theme) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(26,34,63,0.92)'
    : 'rgba(255,255,255,0.92)',
  boxShadow: '0 8px 32px 0 rgba(58,134,255,0.10)',
  backdropFilter: 'blur(18px) saturate(180%)',
  borderRadius: '0 32px 32px 0',
  borderRight: `1.5px solid ${theme.palette.divider}`,
  transition: 'background 0.3s',
});

const AdminBase = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserFromJWT();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handleMenuClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userType');
    window.location.href = '/';
  };

  // Determine active menu item robustly
  const isActive = (itemPath) => {
    if (itemPath === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <CssBaseline />
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          ...glassyAppBar(theme),
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar sx={{ minHeight: 80, px: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
            <Typography variant="h4" noWrap sx={{ fontWeight: 900, letterSpacing: '-1.5px', background: 'linear-gradient(90deg, #3a86ff, #36f1cd 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }} onClick={() => navigate('/admin')}>
              Admin
          </Typography>
            <Box sx={{ ml: 1, px: 1.5, py: 0.5, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(58,134,255,0.13)' : 'rgba(58,134,255,0.10)', fontWeight: 700, fontSize: '0.95rem', color: theme.palette.primary.main }}>
              Dashboard
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton color="inherit" onClick={toggleTheme}>
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, px: 2, py: 1, borderRadius: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(58,134,255,0.10)' : 'rgba(58,134,255,0.07)', boxShadow: '0 2px 8px 0 #3a86ff11' }}>
                <Avatar src={user.picture} alt={user.name} sx={{ width: 44, height: 44, bgcolor: theme.palette.background.default, color: theme.palette.primary.main, border: `2px solid ${theme.palette.primary.main}` }}>
                {user.name ? user.name[0] : user.email[0]}
              </Avatar>
                <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: 700, fontSize: '1.1rem' }}>
                {user.name || user.email}
              </Typography>
            </Box>
          )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            ...glassyDrawer(theme),
            color: theme.palette.text.primary,
            borderRight: `1.5px solid ${theme.palette.divider}`,
            boxShadow: '0 8px 32px 0 rgba(58,134,255,0.10)',
            pt: 0,
          },
          display: { xs: 'none', sm: 'block' },
        }}
        open
      >
        <Toolbar />
        {/* Branding/Logo */}
        <Divider sx={{ my: 1 }} />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <Typography variant="overline" sx={{ pl: 3, color: theme.palette.text.secondary, fontWeight: 700, letterSpacing: 1, mb: 1 }}>Navigation</Typography>
          <List sx={{ mb: 2 }}>
            {adminMenu.map((item) => (
              <ListItem
                button
                key={item.label}
                onClick={() => handleMenuClick(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(58,134,255,0.13)' : 'rgba(58,134,255,0.10)',
                    color: theme.palette.primary.main,
                  },
                  '&.Mui-selected, &.Mui-selected:hover': {
                    bgcolor: theme.palette.primary.main, 
                    color: theme.palette.getContrastText(theme.palette.primary.main),
                    fontWeight: 700,
                  },
                }}
                selected={isActive(item.path)}
              >
                <ListItemIcon sx={{ color: theme.palette.primary.main }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="overline" sx={{ pl: 3, color: theme.palette.text.secondary, fontWeight: 700, letterSpacing: 1, mb: 1 }}>Account</Typography>
          <List>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                mx: 1,
                mt: 1,
                bgcolor: 'rgba(255,76,76,0.08)',
                color: '#ff4d4f',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: 'rgba(255,76,76,0.18)',
                  color: '#fff',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#ff4d4f' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          mt: 1,
          ml: 1,
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminBase;
