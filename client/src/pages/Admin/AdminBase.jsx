import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

const drawerWidth = 220;

const adminMenu = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { label: 'Home', icon: <HomeIcon />, path: '/admin/home' },
  { label: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
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

const AdminBase = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUserFromJWT();

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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f6fa' }}>
      <CssBaseline />
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#1976d2',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Admin Dashboard
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src={user.picture} alt={user.name} sx={{ width: 36, height: 36, bgcolor: '#fff', color: '#1976d2' }}>
                {user.name ? user.name[0] : user.email[0]}
              </Avatar>
              <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
                {user.name || user.email}
              </Typography>
            </Box>
          )}
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
            bgcolor: '#fff',
            borderRight: '1px solid #e0e0e0',
          },
          display: { xs: 'none', sm: 'block' },
        }}
        open
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {adminMenu.map((item) => (
              <ListItem button key={item.label} onClick={() => handleMenuClick(item.path)}>
                <ListItemIcon sx={{ color: '#1976d2' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon sx={{ color: '#ff6b6b' }}>
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
          p: 3,
          mt: 8,
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#f5f6fa',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminBase;
