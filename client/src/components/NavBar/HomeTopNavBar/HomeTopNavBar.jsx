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
  Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Search,
  Add
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Helper to decode JWT and get user info
function getUserFromJWT() {
  const token = localStorage.getItem('jwt');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userType: payload.userType,
      email: payload.email,
      name: payload.name,
      picture: payload.picture // If you store a photoURL in custom claims
    };
  } catch {
    return null;
  }
}

const HomeTopNavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const user = getUserFromJWT();

  // Determine avatar source
  let avatarSrc = undefined;
  if (user?.userType === 'admin') {
    avatarSrc = '/images/admin.png'; // This will resolve to public/images/admin.png
  } else if (user?.picture) {
    avatarSrc = user.picture;
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleDashboard = () => {
    if (user?.userType === 'admin') {
      navigate('/admin');
    } else if (user?.userType === 'user') {
      navigate('/user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.reload();
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <AppBar position="fixed" sx={{ bgcolor: 'white', color: 'black', boxShadow: 1, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth="lg">
        <Toolbar>
          {/* Logo */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 0, 
              mr: 4,
              fontWeight: 'bold',
              color: '#1976d2',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            CrowdFundNext
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 3 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    color: 'black',
                    '&:hover': { color: '#1976d2' }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <Box sx={{ flexGrow: 1 }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          {/* Right side buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit">
              <Search />
            </IconButton>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                bgcolor: '#ff6b6b',
                '&:hover': { bgcolor: '#ff5252' },
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              Start Campaign
            </Button>

            {/* If user is logged in, show avatar and dashboard */}
            {user ? (
              <>
                <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                  <Avatar
                    alt={user.name || user.email}
                    src={avatarSrc}
                    sx={{ width: 46, height: 46, bgcolor: '#ffffff', color: 'white' }}
                  >
                    {user.name ? user.name[0] : user.email[0]}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => { handleMenuClose(); handleDashboard(); }}>
                    Dashboard
                  </MenuItem>
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
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': { borderColor: '#1976d2', bgcolor: 'rgba(25, 118, 210, 0.04)' }
                  }}
                >
                  Register
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': { borderColor: '#1976d2', bgcolor: 'rgba(25, 118, 210, 0.04)' }
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu */}
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMenuClose}
          >
            {menuItems.map((item) => (
              <MenuItem 
                key={item.label}
                onClick={() => { 
                  handleMenuClose(); 
                  navigate(item.path); 
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default HomeTopNavBar;