import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import HomeTopNavBar from '../../components/NavBar/HomeTopNavBar/HomeTopNavBar';

const AboutPage = () => {
  return (
    <Box>
      <HomeTopNavBar />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          About CrowdFundNext
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mt: 2 }}>
          Learn more about our crowdfunding platform mission and vision.
        </Typography>
      </Container>
    </Box>
  );
};

export default AboutPage;