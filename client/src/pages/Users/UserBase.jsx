import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, InputBase, Menu, MenuItem, Container } from '@mui/material';
import { Home, Settings, Logout, Search } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

function UserBase() {
  const user = useUser();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userType');
    window.location.href = '/';
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f6fa' }}>
      <AppBar position="fixed" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          {/* Logo/Brand */}
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', mr: 3, cursor: 'pointer' }}
            onClick={() => navigate('/user')}
          >
            CrowdFundNext
          </Typography>
          {/* Search Bar */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', bgcolor: 'white', borderRadius: 2, px: 2, mr: 3, maxWidth: 400 }}>
            <Search sx={{ color: '#1976d2', mr: 1 }} />
            <InputBase placeholder="Search campaigns, people..." sx={{ flex: 1 }} />
          </Box>
          {/* User Name & Avatar on right */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            {user && (
              <Typography variant="body1" sx={{ mr: 2, fontWeight: 500 }}>
                {user.firstName} {user.lastName}
              </Typography>
            )}
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar
                alt={user?.firstName || user?.email}
                src={user?.profilePicture ? `${import.meta.env.VITE_API_URL}${user.profilePicture}` : undefined}
                sx={{ width: 44, height: 44, bgcolor: '#ff6b6b', color: 'white' }}
              >
                {user?.firstName ? user.firstName[0] : (user?.email ? user.email[0] : '')}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={() => { handleMenuClose(); navigate('/user'); }}>
                <Home sx={{ mr: 1 }} /> Home
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); navigate('/user/settings'); }}>
                <Settings sx={{ mr: 1 }} /> Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pt: 10, pb: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default UserBase;
