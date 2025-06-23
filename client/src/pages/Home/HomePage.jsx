import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { 
  Favorite, 
  TrendingUp, 
  Security, 
  People,
  Menu as MenuIcon 
} from '@mui/icons-material';
import HomeTopNavBar from '../../components/NavBar/HomeTopNavBar/HomeTopNavBar';

const HomePage = () => {
  const features = [
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Easy Campaign Creation',
      description: 'Launch your crowdfunding campaign in minutes with our intuitive interface.'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Secure Donations',
      description: 'Safe and secure payment processing with full transparency for donors.'
    },
    {
      icon: <People sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Community Support',
      description: 'Connect with supporters through comments, likes, and regular updates.'
    },
    {
      icon: <Favorite sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Monthly Subscriptions',
      description: 'Enable recurring donations for ongoing support of your cause.'
    }
  ];

  return (
    <Box>
      <HomeTopNavBar />
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 10,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Turn Your Ideas Into Reality
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            The modern crowdfunding platform that connects creators with supporters worldwide
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ 
                bgcolor: '#ff6b6b', 
                '&:hover': { bgcolor: '#ff5252' },
                px: 4,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Start Your Campaign
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                px: 4,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Explore Campaigns
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Why Choose CrowdFundNext?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Everything you need to run a successful crowdfunding campaign
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  p: 2,
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    transition: 'transform 0.3s ease-in-out',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box 
        sx={{ 
          bgcolor: '#f5f5f5',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of creators who have successfully funded their dreams
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              bgcolor: '#1976d2',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            Create Your First Campaign
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;