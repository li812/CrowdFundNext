import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Paper,
  Fade
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Google,
  Login as LoginIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../../utils/firebase';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

// Glassmorphic + 3D glow style
const glass3DGlowStyle = (theme) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(26,34,63,0.92)'
    : 'rgba(255,255,255,0.92)',
  boxShadow: `
    0 8px 32px 0 rgba(58,134,255,0.10),
    0 1.5px 8px 0 rgba(26,34,63,0.10),
    0 2px 24px 0 rgba(58,134,255,0.10),
    0 0.5px 1.5px 0 rgba(255,255,255,0.18) inset,
    0 0 32px 8px #3a86ff44
  `,
  backdropFilter: 'blur(18px) saturate(180%)',
  borderRadius: '32px',
  border: '1.5px solid rgba(255,255,255,0.13)',
  overflow: 'hidden',
  position: 'relative',
  transform: 'translateZ(0)',
  transition: 'box-shadow 0.3s'
});

const LoginPage = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setSuccess(false);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const token = await auth.currentUser.getIdToken(true);
      localStorage.setItem('jwt', token);
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.userType) localStorage.setItem('userType', payload.userType);
      else localStorage.removeItem('userType');
      setSuccess(true);
      setTimeout(() => { window.location.href = '/'; }, 1200);
    } catch (error) {
      setErrors({ general: error.message || 'Login failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setSuccess(false);
    try {
      await signInWithPopup(auth, googleProvider);
      const token = await auth.currentUser.getIdToken(true);
      localStorage.setItem('jwt', token);

      // Check if user exists in MongoDB
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 404) {
        // User not in MongoDB, redirect to complete registration
        window.location.href = '/complete-register';
        return;
      }
      setSuccess(true);
      setTimeout(() => { window.location.href = '/'; }, 1200);
    } catch (error) {
      setErrors({ general: error.message || 'Google login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Animated glassy 3D glow blobs (blue/mint, not rainbow)
  const AnimatedBg = () => (
    <>
      <motion.div
        initial={{ scale: 0.95, opacity: 0.5 }}
        animate={{ scale: [0.95, 1.05, 0.98, 1], opacity: [0.5, 0.7, 0.6, 0.5] }}
        transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-120px',
          left: '-120px',
          width: 340,
          height: 340,
          zIndex: 0,
          filter: 'blur(80px)',
          borderRadius: '50%',
          boxShadow: '0 0 64px 16px #3a86ff33',
          opacity: 0.7,
        }}
      />
      <motion.div
        initial={{ scale: 1, opacity: 0.3 }}
        animate={{ scale: [1, 1.08, 0.98, 1], opacity: [0.3, 0.6, 0.4, 0.3] }}
        transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '-80px',
          right: '-80px',
          width: 220,
          height: 220,
          zIndex: 0,
          filter: 'blur(60px)',
          borderRadius: '50%',
          boxShadow: '0 0 32px 8px #36f1cd33',
          opacity: 0.5,
        }}
      />
    </>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <AnimatedBg />
      <Fade in timeout={900}>
        <Paper
          elevation={0}
          sx={{
            ...glass3DGlowStyle(theme),
            maxWidth: 410,
            width: '100%',
            mx: 'auto',
            p: { xs: 3, sm: 5 },
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            // 3D effect: subtle perspective and glow
            transform: { xs: 'none', md: 'perspective(1200px) rotateX(2deg) scale(1.01)' },
            boxShadow: `
              0 8px 32px 0 rgba(58,134,255,0.10),
              0 1.5px 8px 0 rgba(26,34,63,0.10),
              0 2px 24px 0 rgba(58,134,255,0.10),
              0 0.5px 1.5px 0 rgba(255,255,255,0.18) inset,
              0 0 32px 8px #3a86ff44,
              0 24px 48px 0 #1a223f11
            `
          }}
          component={motion.form}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          onSubmit={handleEmailLogin}
        >
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              color: theme.palette.primary.main,
              mb: 1,
              letterSpacing: '-1.2px',
              textShadow: '0 2px 12px #3a86ff22'
            }}
          >
            Sign in to CrowdFundNext
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
            Welcome back! Please enter your details.
          </Typography>

          {errors.general && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {errors.general}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
              Login successful! Redirecting...
            </Alert>
          )}

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<Google />}
            onClick={handleGoogleLogin}
            disabled={isLoading}
            sx={{
              mb: 2,
              py: 1.3,
              borderColor: '#3a86ff',
              color: '#3a86ff',
              fontWeight: 700,
              letterSpacing: 0.5,
              background: 'rgba(58,134,255,0.03)',
              boxShadow: '0 2px 8px 0 #3a86ff11',
              '&:hover': {
                borderColor: '#36f1cd',
                color: '#36f1cd',
                bgcolor: 'rgba(58,134,255,0.06)'
              }
            }}
          >
            Continue with Google
          </Button>

          <Divider sx={{ my: 2, width: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <TextField
            fullWidth
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    disabled={isLoading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ textAlign: 'right', width: '100%', mb: 2 }}>
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => navigate('/forgot-password')}
              disabled={isLoading}
              sx={{ fontWeight: 500 }}
            >
              Forgot your password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            endIcon={<LoginIcon />}
            sx={{
              py: 1.3,
              mb: 2,
              fontWeight: 700,
              fontSize: '1.1rem',
              borderRadius: 2.5,
              background: theme.palette.primary.main,
              color: theme.palette.getContrastText(theme.palette.primary.main),
              boxShadow: `
                0 4px 24px 0 #3a86ff22,
                0 0 16px 4px #3a86ff44
              `,
              letterSpacing: 1,
              '&:hover': {
                background: theme.palette.secondary.main,
                color: theme.palette.getContrastText(theme.palette.secondary.main),
                boxShadow: `
                  0 8px 32px 0 #36f1cd33,
                  0 0 32px 8px #36f1cd44
                `,
                transform: 'scale(1.03)',
              }
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
            Don&apos;t have an account?{' '}
            <Link
              component="button"
              type="button"
              onClick={() => navigate('/register')}
              disabled={isLoading}
              sx={{ fontWeight: 'bold' }}
            >
              Sign up here
            </Link>
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default LoginPage;