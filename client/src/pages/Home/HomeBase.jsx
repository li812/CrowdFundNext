import React from 'react';
import HomeTopNavBar from '../../components/NavBar/HomeTopNavBar/HomeTopNavBar';
import { Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const HomeBase = () => (
  <Box>
    <HomeTopNavBar />
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
  </Box>
);

export default HomeBase;