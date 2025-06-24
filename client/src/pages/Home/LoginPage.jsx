import React from 'react';
import { Container, Box } from '@mui/material';
import Login from '../../components/Forms/Login/Login';

const LoginPage = () => {
  return (
    <Box>
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Login />
      </Container>
    </Box>
  );
};

export default LoginPage;