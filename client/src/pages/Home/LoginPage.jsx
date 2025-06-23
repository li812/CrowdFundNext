import React from 'react';
import { Container, Box } from '@mui/material';
import HomeTopNavBar from '../../components/NavBar/HomeTopNavBar/HomeTopNavBar';
import Login from '../../components/Forms/Login/Login';

const LoginPage = () => {
  return (
    <Box>
      <HomeTopNavBar />
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Login />
      </Container>
    </Box>
  );
};

export default LoginPage;