import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import HomeTopNavBar from '../../components/NavBar/HomeTopNavBar/HomeTopNavBar';

const ContactPage = () => {
  return (
    <Box>
      <HomeTopNavBar />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mt: 2 }}>
          Get in touch with our support team.
        </Typography>
      </Container>
    </Box>
  );
};

export default ContactPage;