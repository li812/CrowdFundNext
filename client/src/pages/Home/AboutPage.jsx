import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, 
  useTheme, Stack, Chip, Avatar, Divider 
} from '@mui/material';
import { 
  EmojiObjects, Favorite, Security, People, 
  TrendingUp, Star, RocketLaunch, Diversity3,
  School, Business, Psychology, Engineering
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';

// Import images for AboutPage
import whyImage1 from '/images/whyImages/1.png';
import whyImage2 from '/images/whyImages/2.png';
import whyImage3 from '/images/whyImages/3.png';
import whyImage4 from '/images/whyImages/4.png';

// Glassmorphic & liquid helpers
const glassStyle = (theme) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(26,34,63,0.85)'
    : 'rgba(255,255,255,0.85)',
  boxShadow: '0 8px 32px 0 rgba(58, 134, 255, 0.18)',
  backdropFilter: 'blur(24px) saturate(180%)',
  borderRadius: '24px',
  border: '1.5px solid rgba(255,255,255,0.18)',
  overflow: 'hidden',
  position: 'relative'
});

const heroGradient = (theme) =>
  theme.palette.mode === 'dark'
    ? 'linear-gradient(120deg, #3a86ff 0%, #36f1cd 40%, #ffe066 70%, #ff4d6d 100%)'
    : 'linear-gradient(120deg, #3a86ff 0%, #36f1cd 40%, #ffe066 70%, #ff4d6d 100%)';

const AboutPage = ({ missionVision: mv, coreValues: cv, stats: st, team: tm }) => {
  const theme = useTheme();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Mission & Vision
  const missionVision = mv || [
    {
      icon: <EmojiObjects sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Our Mission',
      description: 'To democratize funding and empower the next generation of creators, innovators, and dreamers by providing the most accessible and student-friendly crowdfunding platform.',
      color: theme.palette.primary.main
    },
    {
      icon: <RocketLaunch sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      title: 'Our Vision',
      description: 'A world where every great idea has the opportunity to become reality, where students and young creators can turn their dreams into successful projects with community support.',
      color: theme.palette.secondary.main
    }
  ];

  // Core Values
  const coreValues = cv || [
    {
      icon: <People sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
      title: 'Community First',
      description: 'We believe in the power of collective support and building meaningful connections.'
    },
    {
      icon: <Security sx={{ fontSize: 32, color: theme.palette.secondary.main }} />,
      title: 'Trust & Transparency',
      description: 'Complete transparency in all transactions and processes to build lasting trust.'
    },
    {
      icon: <Favorite sx={{ fontSize: 32, color: theme.palette.accent.main }} />,
      title: 'Empowerment',
      description: 'Empowering creators with the tools and support they need to succeed.'
    },
    {
      icon: <Diversity3 sx={{ fontSize: 32, color: theme.palette.warning.main }} />,
      title: 'Inclusivity',
      description: 'Creating opportunities for everyone, regardless of background or location.'
    }
  ];

  // Live Impact Stats
  const [impactStats, setImpactStats] = useState(null);
  const [impactLoading, setImpactLoading] = useState(true);
  const [impactError, setImpactError] = useState('');

  useEffect(() => {
    setImpactLoading(true);
    setImpactError('');
    fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/impact-stats`)
      .then(r => r.json())
      .then(res => {
        if (!res.success) throw new Error(res.error || 'Failed to load impact stats');
        setImpactStats(res.stats);
      })
      .catch(err => setImpactError(err.message || 'Failed to load impact stats'))
      .finally(() => setImpactLoading(false));
  }, []);

  const stats = [
    {
      number: impactStats ? impactStats.totalCampaigns.toLocaleString() : '-',
      label: 'Campaigns Launched',
      icon: <TrendingUp />
    },
    {
      number: impactStats ? `$${impactStats.totalFundsRaised.toLocaleString()}` : '-',
      label: 'Total Funds Raised',
      icon: <Star />
    },
    {
      number: impactStats ? impactStats.activeSupporters.toLocaleString() : '-',
      label: 'Active Supporters',
      icon: <People />
    },
    {
      number: impactStats ? `${impactStats.successRate}%` : '-',
      label: 'Success Rate',
      icon: <EmojiObjects />
    }
  ];

  // Team (Ali Ahammad)
  const team = tm || [
    {
      name: 'Ali Ahammad',
      role: 'Aspiring Software Developer',
      avatar: <Avatar sx={{ width: 80, height: 80, bgcolor: theme.palette.primary.main, color: 'white', fontSize: 40 }}>A</Avatar>,
      bio: `Aspiring software developer with hands-on experience in web development using React.js, backend API design, and AI-powered solutions including Generative AI. Proven ability to integrate machine learning models into full-stack cloud applications for real-world use cases. Strong academic foundation with a passion for clean code, innovation, and continuous learning.`,
      contact: {
        address: '254, 12-Muri Nagar, 691020, Kerala, India',
        phone: '+91 9895850894',
        email: 'mail@aliahammad.com',
        website: 'www.aliahammad.com',
        github: 'https://github.com/li812',
        linkedin: 'https://linkedin.com/in/ali-ahammad-li0812'
      }
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: theme.palette.mode === 'dark'
        ? 'radial-gradient(ellipse at 60% 40%, #3a86ff44 0%, #1a223f 100%)'
        : 'radial-gradient(ellipse at 60% 40%, #36f1cd44 0%, #f4f6fb 100%)',
      pb: 8 
    }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          sx={{
            ...glassStyle(theme),
            p: { xs: 4, md: 8 },
            textAlign: 'center',
            mb: { xs: 6, md: 10 }
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            sx={{
              background: heroGradient(theme),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 3,
              letterSpacing: '-1px'
            }}
          >
            About CrowdFundNext
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              mb: 4,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              lineHeight: 1.6,
              maxWidth: 800,
              mx: 'auto'
            }}
          >
            We're on a mission to revolutionize how students and young creators bring their ideas to life. 
            Our platform combines cutting-edge technology with community-driven support to make crowdfunding 
            accessible, transparent, and successful for everyone.
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ flexWrap: 'wrap' }}>
            {['Student-Friendly', 'Secure', 'Transparent', 'Community-Driven'].map(tag => (
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
                  mr: 1, mb: 1,
                  '&:hover': { bgcolor: 'rgba(58,134,255,0.10)' }
                }}
              />
            ))}
          </Stack>
        </Box>
      </Container>

      {/* Mission & Vision Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {missionVision.map((item, index) => (
            <Grid item xs={12} md={6} key={item.title} display="flex" justifyContent="center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    ...glassStyle(theme),
                    height: '100%',
                    p: { xs: 3, md: 4 },
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: { xs: 500, sm: 600, md: 700 },
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 48px 0 rgba(58, 134, 255, 0.25)'
                    }
                  }}
                >
                  <Box sx={{ mb: 3, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {/* Background Image */}
                    <Box
                      component="img"
                      src={index === 0 ? whyImage1 : whyImage2}
                      alt={item.title}
                      sx={{
                        width: { xs: 200, sm: 300, md: 400 },
                        height: { xs: 200, sm: 300, md: 400 },
                        objectFit: 'cover',
                        borderRadius: 2,
                        opacity: 0.9,
                        mx: 'auto',
                        transition: 'all 0.3s ease',
                        display: 'block',
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
                      width: { xs: 60, sm: 80, md: 100 },
                      height: { xs: 60, sm: 80, md: 100 },
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                    }}>
                      {React.cloneElement(item.icon, { 
                        sx: { 
                          fontSize: { xs: 32, sm: 40, md: 48 }, 
                          color: item.color
                        } 
                      })}
                    </Box>
                  </Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    fontWeight="bold"
                    sx={{
                      mb: 2,
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      color: item.color,
                      textAlign: 'center',
                      mx: 'auto'
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      lineHeight: 1.6,
                      textAlign: 'center',
                      mx: 'auto'
                    }}
                  >
                    {item.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Statistics Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <motion.div
          initial="hidden"
          alignContent= 'center'
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            fontWeight="bold"
            sx={{
              background: heroGradient(theme),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', md: '2.8rem' },
              mb: { xs: 4, md: 6 }
            }}
          >
            Our Impact
          </Typography>
          {impactLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}><CircularProgress /></Box>
          ) : impactError ? (
            <Typography color="error" textAlign="center">{impactError}</Typography>
          ) : (
            <Grid container spacing={3} alignContent= 'center'>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={stat.label} alignContent= 'center'>
                  <motion.div variants={fadeInUp} alignContent= 'center'>
                    <Card
                      sx={{
                        ...glassStyle(theme),
                        p: 3,
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 12px 40px 0 rgba(58, 134, 255, 0.25)'
                        }
                      }}
                    >
                      <Box sx={{ 
                        mb: 2, 
                        color: theme.palette.primary.main,
                        display: 'flex',
                        justifyContent: 'center'
                      }}>
                        {stat.icon}
                      </Box>
                      <Typography
                        variant="h3"
                        component="div"
                        fontWeight="bold"
                        sx={{
                          background: heroGradient(theme),
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontSize: { xs: '2rem', md: '2.5rem' },
                          mb: 1
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        {stat.label}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </motion.div>
      </Container>

      {/* Core Values Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            fontWeight="bold"
            sx={{
              background: heroGradient(theme),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', md: '2.8rem' },
              mb: { xs: 4, md: 6 },
              mx: 'auto'
            }}
          >
            Our Core Values
          </Typography>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            {coreValues.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={value.title} display="flex" justifyContent="center">
                <motion.div variants={fadeInUp}>
                  <Card
                    sx={{
                      ...glassStyle(theme),
                      p: 3,
                      textAlign: 'center',
                      height: '100%',
                      minHeight: { xs: 350, sm: 400, md: 450 },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px 0 rgba(58, 134, 255, 0.25)'
                      }
                    }}
                  >
                    <Box sx={{ mb: 2, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {/* Background Image */}
                      <Box
                        component="img"
                        src={[whyImage3, whyImage4, whyImage1, whyImage2][index]}
                        alt={value.title}
                        sx={{
                          width: { xs: 150, sm: 200, md: 250 },
                          height: { xs: 150, sm: 200, md: 250 },
                          objectFit: 'cover',
                          borderRadius: 2,
                          opacity: 0.9,
                          mx: 'auto',
                          transition: 'all 0.3s ease',
                          display: 'block',
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
                        width: { xs: 40, sm: 50, md: 60 },
                        height: { xs: 40, sm: 50, md: 60 },
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                      }}>
                        {React.cloneElement(value.icon, { 
                          sx: { 
                            fontSize: { xs: 20, sm: 24, md: 28 }, 
                            color: value.icon.props.sx?.color || theme.palette.primary.main
                          } 
                        })}
                      </Box>
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      fontWeight="bold"
                      sx={{ mb: 1.5, fontSize: { xs: '1.1rem', md: '1.3rem' }, textAlign: 'center', mx: 'auto' }}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.5, textAlign: 'center', mx: 'auto' }}
                    >
                      {value.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            fontWeight="bold"
            sx={{
              background: heroGradient(theme),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', md: '2.8rem' },
              mb: { xs: 4, md: 6 }
            }}
          >
            Meet Our Team
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: { xs: 4, md: 6 }, fontSize: { xs: '1rem', md: '1.2rem' } }}
          >
            The passionate individual behind CrowdFundNext
          </Typography>
          <Box display="flex" justifyContent="center">
            <motion.div variants={fadeInUp}>
              <Card
                sx={{
                  ...glassStyle(theme),
                  p: 4,
                  textAlign: 'left',
                  maxWidth: 700,
                  mx: 'auto',
                  borderRadius: 5,
                  boxShadow: '0 8px 32px 0 #3a86ff22',
                  mb: 4
                }}
              >
                <Box display="flex" alignItems="center" gap={3} mb={2}>
                  <Avatar sx={{ width: 90, height: 90, fontSize: 48, bgcolor: theme.palette.primary.main, color: 'white' }}>A</Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={900} mb={0.5}>Ali Ahammad</Typography>
                    <Typography variant="subtitle1" color="primary" fontWeight={700} mb={1}>Aspiring Software Developer</Typography>
                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                      <Typography variant="body2" color="text.secondary">254, 12-Muri Nagar, 691020, Kerala, India</Typography>
                      <Divider orientation="vertical" flexItem />
                      <Typography variant="body2" color="text.secondary">+91 9895850894</Typography>
                      <Divider orientation="vertical" flexItem />
                      <Typography variant="body2" color="text.secondary">mail@aliahammad.com</Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                      <a href="https://www.aliahammad.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <Chip label="Website" color="primary" variant="outlined" size="small" />
                      </a>
                      <a href="https://github.com/li812" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <Chip label="GitHub" color="secondary" variant="outlined" size="small" />
                      </a>
                      <a href="https://linkedin.com/in/ali-ahammad-li0812" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <Chip label="LinkedIn" color="info" variant="outlined" size="small" />
                      </a>
                    </Stack>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" color="text.secondary" mb={2}>
                  Aspiring software developer with hands-on experience in web development using React.js, backend API design, and AI-powered solutions including Generative AI. Proven ability to integrate machine learning models into full-stack cloud applications for real-world use cases. Strong academic foundation with a passion for clean code, innovation, and continuous learning.
                </Typography>

                <Divider sx={{ my: 2 }} />

              </Card>
            </motion.div>
          </Box>
        </motion.div>
      </Container>

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Box
            sx={{
              ...glassStyle(theme),
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              background: theme.palette.mode === 'dark'
                ? 'rgba(26,34,63,0.92)'
                : 'rgba(255,255,255,0.92)',
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              fontWeight="bold"
              sx={{
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.2rem' }
              }}
            >
              Ready to Join Our Mission?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 4,
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.5
              }}
            >
              Start your crowdfunding journey today and be part of a community that believes in the power of dreams.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ flexWrap: 'wrap' }}>
              <Chip
                label="Start a Campaign"
                color="primary"
                variant="filled"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  px: 3,
                  py: 1,
                  '&:hover': { transform: 'scale(1.05)' },
                  transition: 'transform 0.2s'
                }}
              />
              <Chip
                label="Explore Projects"
                color="secondary"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  px: 3,
                  py: 1,
                  '&:hover': { transform: 'scale(1.05)' },
                  transition: 'transform 0.2s'
                }}
              />
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AboutPage;