import React from 'react';
import { Container, Box } from '@mui/material';
import HomeTopNavBar from '../../components/NavBar/HomeTopNavBar/HomeTopNavBar';
import Register from '../../components/Forms/Register/Register';

const RegisterPage = () => {
  return (
    <Box>
      <HomeTopNavBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Register />
      </Container>
    </Box>
  );
};

export default RegisterPage;