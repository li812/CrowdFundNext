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
import UserTopNavBar from '../../components/NavBar/UserTopNavBar/UserTopNavBar';

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
      overflowX: 'hidden'
    }}>
      <UserTopNavBar />
      <Container
        maxWidth="xxlg"
        sx={{ py: 1, mt: { xs: 8, sm: 1 } }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}

export default UserBase;
