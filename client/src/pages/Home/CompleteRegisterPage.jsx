import React from 'react';
import { Container, Box } from '@mui/material';
import Register from '../../components/Forms/Register/Register';

const RegisterPage = () => {
  return (
    <Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Register />
      </Container>
    </Box>
  );
};

export default RegisterPage;