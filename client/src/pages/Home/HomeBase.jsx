import React from 'react';
import HomeTopNavBar from '../../components/NavBar/HomeTopNavBar/HomeTopNavBar';
import { Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const HomeBase = () => (
  <Box>
    <HomeTopNavBar />
    <Container maxWidth="lg" sx={{ py: 4, mt: { xs: 7, sm: 8 } }}>
      <Outlet />
    </Container>
  </Box>
);

export default HomeBase;