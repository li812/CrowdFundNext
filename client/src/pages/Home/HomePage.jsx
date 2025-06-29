import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, useTheme, Stack, Chip } from '@mui/material';
import { TrendingUp, Security, People, Favorite, RocketLaunch, EmojiObjects, Diversity3, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Leaderboard from '../../components/Leaderboard/Leaderboard';

// Import why images
import whyImage1 from '/images/whyImages/1.png';
import whyImage2 from '/images/whyImages/2.png';
import whyImage3 from '/images/whyImages/3.png';
import whyImage4 from '/images/whyImages/4.png';

// Import crowdfunding images
import crowdfundingMain from '/images/crowdfunding/crowdfunding-main.png';
import crowdfundingDonation from '/images/crowdfunding/crowdfunding-donation.png';
import crowdfundingReward from '/images/crowdfunding/crowdfunding-reward.png';
import crowdfundingEquity from '/images/crowdfunding/crowdfunding-equity.png';
import crowdfundingDebt from '/images/crowdfunding/crowdfunding-debt.png';

// Glassmorphic & liquid helpers
const glassStyle = (theme) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(26,34,63,0.65)'
    : 'rgba(215, 215, 215, 0.51)',
  boxShadow: '0 12px 48px 0 rgba(58, 134, 255, 0.18)',
  backdropFilter: 'blur(24px) saturate(180%)',
  borderRadius: '36px',
  border: '1.5px solid rgba(255,255,255,0.18)',
  overflow: 'hidden',
  position: 'relative'
});
const liquidBg = (theme) =>
  theme.palette.mode === 'dark'
    ? 'radial-gradient(ellipse at 60% 40%, #3a86ff44 0%, #1a223f 100%)'
    : 'radial-gradient(ellipse at 60% 40%, #36f1cd44 0%, #f4f6fb 100%)';

const heroGradient = (theme) =>
  theme.palette.mode === 'dark'
    ? 'linear-gradient(120deg, #3a86ff 0%, #36f1cd 40%, #ffe066 70%, #ff4d6d 100%)'
    : 'linear-gradient(120deg, #3a86ff 0%, #36f1cd 40%, #ffe066 70%, #ff4d6d 100%)';

const HomePage = () => {
  const theme = useTheme();

  // Animation variants
  const heroVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: 'easeOut' } }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + i * 0.15, duration: 0.8, type: 'spring', stiffness: 120 }
    })
  };

  // Award-level features
  const features = [
    {
      icon: <RocketLaunch sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      image: whyImage1,
      title: 'Launch in Seconds',
      description: 'Start a campaign with just a few clicks. No friction, no fuss.'
    },
    {
      icon: <EmojiObjects sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      image: whyImage2,
      title: 'For Creators & Dreamers',
      description: 'Perfect for students, makers, and visionaries. Bring your ideas to life.'
    },
    {
      icon: <Diversity3 sx={{ fontSize: 48, color: theme.palette.accent.main }} />,
      image: whyImage3,
      title: 'Community-Powered',
      description: 'Grow with a global community that believes in your mission.'
    },
    {
      icon: <Star sx={{ fontSize: 48, color: theme.palette.warning.main }} />,
      image: whyImage4,
      title: 'Transparent & Trusted',
      description: 'Bank-grade security, transparent progress, and real-time updates.'
    }
  ];

  // Trending tags for extra modern touch
  const trendingTags = [
    'Tech', 'Education', 'Health', 'Art', 'Social Good', 'Environment', 'Startups', 'Student Life'
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: liquidBg(theme), 
      pb: 8, 
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          component={motion.section}
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          sx={{
            ...glassStyle(theme),
            mt: { xs: 8, sm: 10, md: 12 },
            py: { xs: 6, sm: 8, md: 12 },
            px: { xs: 3, sm: 4, md: 6 },
            textAlign: 'center',
            mb: { xs: 8, sm: 10, md: 12 },
            position: 'relative',
            maxWidth: '100%',
            mx: 'auto',
            minHeight: { xs: '60vh', sm: '70vh', md: '80vh' },
            maxHeight: { xs: '90vh', sm: '95vh', md: '100vh' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {/* Liquid Glass Animated Blobs */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0.7 }}
            animate={{ scale: [0.95, 1.1, 0.98, 1], opacity: [0.7, 1, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '-140px',
              left: '-140px',
              width: 480,
              height: 480,
              zIndex: 0,
              background: 'radial-gradient(circle at 60% 40%, #3a86ff99 0%, #36f1cdcc 100%)',
              filter: 'blur(120px)',
              borderRadius: '50%',
              opacity: 0.7,
            }}
          />
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: [1, 1.12, 0.98, 1], opacity: [0.5, 0.8, 0.7, 0.5] }}
            transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut', delay: 2 }}
            style={{
              position: 'absolute',
              bottom: '-120px',
              right: '-120px',
              width: 380,
              height: 380,
              zIndex: 0,
              background: 'radial-gradient(circle at 40% 60%, #ff4d6d99 0%, #ffe066cc 100%)',
              filter: 'blur(100px)',
              borderRadius: '50%',
              opacity: 0.6,
            }}
          />
          <Box sx={{ 
            position: 'relative', 
            zIndex: 1, 
            maxWidth: 'md', 
            mx: 'auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: { xs: '50vh', sm: '60vh', md: '70vh' }
          }}>
            <Typography
              variant="h1"
              component={motion.h1}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1.1 }}
              fontWeight="bold"
              sx={{
                background: heroGradient(theme),
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', sm: '3.2rem', md: '4.2rem' },
                mb: { xs: 2, sm: 3 },
                letterSpacing: '-2px',
                lineHeight: 1.1,
                textShadow: '0 2px 32px #36f1cd33',
                minHeight: { xs: '4rem', sm: '5rem', md: '6rem' }
              }}
            >
              <span style={{ fontWeight: 900 }}>CrowdFundNext</span>
              <br />
              <Box component="span" sx={{ 
                fontWeight: 900, 
                background: 'linear-gradient(90deg, #ff4d6d, #3a86ff 80%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.2rem' }
              }}>
                Crowd funding
              </Box>
            </Typography>
            <Typography
              variant="h5"
              component={motion.p}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.1 }}
              sx={{
                mb: { xs: 3, sm: 4 },
                color: theme.palette.text.secondary,
                fontWeight: 500,
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                letterSpacing: '0.3px',
                lineHeight: 1.4,
                minHeight: { xs: '3rem', sm: '3.5rem', md: '4rem' }
              }}
            >
              The world's most advanced, student-friendly crowdfunding platform.
              <br />
              <span style={{ color: theme.palette.accent.main, fontWeight: 700 }}>Empower. Create. Inspire.</span>
            </Typography>
            {/* Trending tags */}
            <Stack 
              direction="row" 
              spacing={1} 
              justifyContent="center" 
              sx={{ 
                mb: { xs: 3, sm: 4 }, 
                flexWrap: 'wrap',
                gap: 1,
                minHeight: { xs: '2.5rem', sm: '3rem' }
              }}
            >
              {trendingTags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  color="primary"
                  variant="outlined"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.18)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    borderRadius: 2,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': { bgcolor: 'rgba(58,134,255,0.10)' }
                  }}
                />
              ))}
            </Stack>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1.1 }}
              sx={{ 
                display: 'flex', 
                gap: { xs: 2, sm: 2.5, md: 3 }, 
                justifyContent: 'center', 
                flexWrap: 'wrap', 
                mb: 2,
                minHeight: { xs: '3.5rem', sm: '4rem', md: '4.5rem' }
              }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: theme.palette.accent.main,
                  color: theme.palette.getContrastText(theme.palette.accent.main),
                  px: { xs: 3, sm: 4, md: 5 },
                  py: { xs: 1.5, sm: 1.6, md: 1.7 },
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                  borderRadius: 16,
                  boxShadow: '0 4px 32px 0 #ff4d6d44',
                  fontWeight: 700,
                  letterSpacing: 1,
                  transition: 'all 0.3s ease',
                  minHeight: { xs: '3rem', sm: '3.5rem', md: '4rem' },
                  '&:hover': {
                    bgcolor: theme.palette.accent.dark || '#d13a54',
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 40px 0 #ff4d6d66',
                  },
                }}
              >
                Start Your Campaign
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  px: { xs: 3, sm: 4, md: 5 },
                  py: { xs: 1.5, sm: 1.6, md: 1.7 },
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(8px)',
                  fontWeight: 700,
                  letterSpacing: 1,
                  transition: 'all 0.3s ease',
                  minHeight: { xs: '3rem', sm: '3.5rem', md: '4rem' },
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    background: 'rgba(58,134,255,0.10)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Explore Campaigns
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 10 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ 
          textAlign: 'center',
          mb: { xs: 6, sm: 7, md: 8 },
          minHeight: { xs: '8rem', sm: '10rem', md: '12rem' }
        }}>
          <Typography
            variant="h3"
            component={motion.h2}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            textAlign="center"
            gutterBottom
            fontWeight="bold"
            sx={{
              background: heroGradient(theme),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', sm: '2.4rem', md: '2.8rem' },
              mb: { xs: 2, sm: 3 },
              letterSpacing: '-1px',
              minHeight: { xs: '3rem', sm: '3.5rem', md: '4rem' }
            }}
          >
            Why CrowdFundNext?
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ 
              mb: { xs: 6, sm: 7, md: 8 }, 
              fontWeight: 400, 
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              px: { xs: 2, sm: 4, md: 6 },
              minHeight: { xs: '3rem', sm: '3.5rem', md: '4rem' }
            }}
          >
            Everything you need to launch, fund, and grow your next big idea.
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 3, sm: 4, md: 4 }} sx={{ alignItems: 'stretch' }}>
          {features.map((feature, i) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Card
                component={motion.div}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={featureVariants}
                sx={{
                  ...glassStyle(theme),
                  height: '100%',
                  textAlign: 'center',
                  p: { xs: 2, sm: 2.5, md: 3 },
                  minHeight: { xs: 380, sm: 420, md: 480 },
                  maxHeight: { xs: 450, sm: 500, md: 580 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  border: 'none',
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(26,34,63,0.85)'
                    : 'rgba(255,255,255,0.85)',
                  boxShadow: '0 8px 32px 0 #3a86ff22',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 16px 48px 0 #3a86ff44',
                    transform: 'translateY(-8px) scale(1.02)'
                  }
                }}
              >
                <CardContent sx={{ 
                  p: 0, 
                  width: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  justifyContent: 'space-between'
                }}>
                  <Box sx={{ 
                    mb: { xs: 2, sm: 2.5, md: 3 }, 
                    position: 'relative', 
                    display: 'flex', 
                    justifyContent: 'center',
                    flex: '1 0 auto',
                    minHeight: { xs: '200px', sm: '220px', md: '240px' },
                    maxHeight: { xs: '250px', sm: '280px', md: '320px' }
                  }}>
                    {/* Background Image */}
                    <Box
                      component="img"
                      src={feature.image}
                      alt={feature.title}
                      sx={{
                        width: { xs: 180, sm: 220, md: 280 },
                        height: { xs: 180, sm: 220, md: 280 },
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'cover',
                        borderRadius: 2,
                        opacity: 0.9,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          opacity: 1,
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                    {/* Icon overlay */}
                    <Box sx={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: { xs: 50, sm: 60, md: 80 },
                      height: { xs: 50, sm: 60, md: 80 },
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                    }}>
                      {React.cloneElement(feature.icon, { 
                        sx: { 
                          fontSize: { xs: 28, sm: 32, md: 40 }, 
                          color: feature.icon.props.sx?.color || theme.palette.primary.main 
                        } 
                      })}
                    </Box>
                  </Box>
                  <Box sx={{ 
                    flex: '1 0 auto', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    minHeight: { xs: '120px', sm: '140px', md: '160px' }
                  }}>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom 
                      fontWeight="bold"
                      sx={{ 
                        fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                        mb: { xs: 1, sm: 1.5 },
                        lineHeight: 1.2,
                        minHeight: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                        lineHeight: 1.5,
                        px: { xs: 1, sm: 1.5 },
                        minHeight: { xs: '3rem', sm: '3.5rem', md: '4rem' }
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Leaderboard Section */}
      <Leaderboard />

      {/* About Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 10 }, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Main Crowdfunding Concept */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1 }}
          sx={{
            ...glassStyle(theme),
            px: { xs: 3, sm: 4, md: 6 },
            py: { xs: 4, sm: 5, md: 6 },
            textAlign: 'center',
            background: theme.palette.mode === 'dark'
              ? 'rgba(26,34,63,0.92)'
              : 'rgba(255,255,255,0.92)',
            boxShadow: '0 8px 32px 0 #36f1cd22',
            mb: { xs: 6, sm: 8, md: 10 },
            minHeight: { xs: '60vh', sm: '70vh', md: '80vh' },
            maxHeight: { xs: '90vh', sm: '95vh', md: '100vh' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
              mb: { xs: 2, sm: 3 },
              lineHeight: 1.2,
              minHeight: { xs: '3rem', sm: '3.5rem', md: '4rem' }
            }}
          >
            What is CrowdFunding?
          </Typography>
          
          <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} alignItems="center" sx={{ flex: 1 }}>
            <Grid item xs={12} md={6} sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '100%'
            }}>
              <Box
                component="img"
                src={crowdfundingMain}
                alt="Crowdfunding Concept"
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  height: 'auto',
                  maxHeight: { xs: '300px', sm: '350px', md: '400px' },
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  display: 'block',
                  margin: '0 auto',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
                  lineHeight: 1.6,
                  textAlign: 'left',
                  minHeight: { xs: '8rem', sm: '10rem', md: '12rem' }
                }}
              >
                Crowdfunding is a way to raise money for a project, cause, or idea by collecting small contributions from a large number of people, typically via the internet. It empowers anyone to turn their dreams into reality with the support of a global community.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Types of Crowdfunding */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.2 }}
          sx={{
            ...glassStyle(theme),
            px: { xs: 3, sm: 4, md: 6 },
            py: { xs: 4, sm: 5, md: 6 },
            textAlign: 'center',
            background: theme.palette.mode === 'dark'
              ? 'rgba(26,34,63,0.92)'
              : 'rgba(255,255,255,0.92)',
            boxShadow: '0 8px 32px 0 #ff4d6d22',
            minHeight: { xs: '80vh', sm: '90vh', md: '100vh' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
              mb: { xs: 3, sm: 4 },
              lineHeight: 1.2,
              minHeight: { xs: '3rem', sm: '3.5rem', md: '4rem' }
            }}
          >
            Types of Crowdfunding
          </Typography>

          <Grid container spacing={{ xs: 3, sm: 4, md: 4 }} sx={{ alignItems: 'stretch', flex: 1 }}>
            {/* Donation-based */}
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                sx={{
                  textAlign: 'center',
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: { xs: '300px', sm: '350px', md: '400px' },
                  maxHeight: { xs: '400px', sm: '450px', md: '500px' },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    background: 'rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box
                  component="img"
                  src={crowdfundingDonation}
                  alt="Donation-based Crowdfunding"
                  sx={{
                    width: { xs: 120, sm: 140, md: 160 },
                    height: { xs: 120, sm: 140, md: 160 },
                    borderRadius: 2,
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold"
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                      mb: 1,
                      color: theme.palette.primary.main,
                      minHeight: { xs: '2.5rem', sm: '3rem' }
                    }}
                  >
                    Donation-based
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      lineHeight: 1.4,
                      minHeight: { xs: '3rem', sm: '3.5rem' }
                    }}
                  >
                    Supporters donate without expecting anything in return
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Reward-based */}
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                sx={{
                  textAlign: 'center',
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: { xs: '300px', sm: '350px', md: '400px' },
                  maxHeight: { xs: '400px', sm: '450px', md: '500px' },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    background: 'rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box
                  component="img"
                  src={crowdfundingReward}
                  alt="Reward-based Crowdfunding"
                  sx={{
                    width: { xs: 120, sm: 140, md: 160 },
                    height: { xs: 120, sm: 140, md: 160 },
                    borderRadius: 2,
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold"
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                      mb: 1,
                      color: theme.palette.secondary.main,
                      minHeight: { xs: '2.5rem', sm: '3rem' }
                    }}
                  >
                    Reward-based
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      lineHeight: 1.4,
                      minHeight: { xs: '3rem', sm: '3.5rem' }
                    }}
                  >
                    Backers receive a reward or product
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Equity-based */}
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                sx={{
                  textAlign: 'center',
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: { xs: '300px', sm: '350px', md: '400px' },
                  maxHeight: { xs: '400px', sm: '450px', md: '500px' },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    background: 'rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box
                  component="img"
                  src={crowdfundingEquity}
                  alt="Equity-based Crowdfunding"
                  sx={{
                    width: { xs: 120, sm: 140, md: 160 },
                    height: { xs: 120, sm: 140, md: 160 },
                    borderRadius: 2,
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold"
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                      mb: 1,
                      color: theme.palette.accent.main,
                      minHeight: { xs: '2.5rem', sm: '3rem' }
                    }}
                  >
                    Equity-based
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      lineHeight: 1.4,
                      minHeight: { xs: '3rem', sm: '3.5rem' }
                    }}
                  >
                    Contributors get shares in the project
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Debt-based */}
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                sx={{
                  textAlign: 'center',
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: { xs: '300px', sm: '350px', md: '400px' },
                  maxHeight: { xs: '400px', sm: '450px', md: '500px' },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    background: 'rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box
                  component="img"
                  src={crowdfundingDebt}
                  alt="Debt-based Crowdfunding"
                  sx={{
                    width: { xs: 120, sm: 140, md: 160 },
                    height: { xs: 120, sm: 140, md: 160 },
                    borderRadius: 2,
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold"
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                      mb: 1,
                      color: theme.palette.warning.main,
                      minHeight: { xs: '2.5rem', sm: '3rem' }
                    }}
                  >
                    Debt-based
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      lineHeight: 1.4,
                      minHeight: { xs: '3rem', sm: '3.5rem' }
                    }}
                  >
                    Supporters lend money and are repaid with interest
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: { xs: 6, sm: 8, md: 10 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1 }}
          sx={{
            ...glassStyle(theme),
            py: { xs: 6, sm: 7, md: 8 },
            px: { xs: 3, sm: 4, md: 6 },
            textAlign: 'center',
            background: theme.palette.mode === 'dark'
              ? 'rgba(26,34,63,0.92)'
              : 'rgba(255,255,255,0.92)',
            boxShadow: '0 8px 32px 0 #ff4d6d22',
            minHeight: { xs: '50vh', sm: '60vh', md: '70vh' },
            maxHeight: { xs: '80vh', sm: '90vh', md: '100vh' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            fontWeight="bold"
            sx={{ 
              fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
              mb: { xs: 2, sm: 2.5 },
              lineHeight: 1.2,
              minHeight: { xs: '3rem', sm: '3.5rem', md: '4rem' }
            }}
          >
            Ready to Get Started?
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              mb: { xs: 3, sm: 4 },
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              lineHeight: 1.5,
              px: { xs: 1, sm: 2 },
              minHeight: { xs: '3rem', sm: '3.5rem', md: '4rem' }
            }}
          >
            Join thousands of creators who have successfully funded their dreams
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.getContrastText(theme.palette.primary.main),
              px: { xs: 4, sm: 4.5, md: 5 },
              py: { xs: 1.5, sm: 1.6, md: 1.7 },
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              borderRadius: 16,
              boxShadow: '0 4px 24px 0 #3a86ff44',
              fontWeight: 700,
              transition: 'all 0.3s ease',
              minHeight: { xs: '3rem', sm: '3.5rem', md: '4rem' },
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
                boxShadow: '0 8px 32px 0 #3a86ff88',
                transform: 'scale(1.05)',
              },
            }}
          >
            Create Your First Campaign
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;