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
  Link
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Google
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../../../utils/firebase';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Firebase email/password login
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const token = await auth.currentUser.getIdToken();
      localStorage.setItem('jwt', token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.userType === 'admin') {
        navigate('/admin');
      } else if (payload.userType === 'user') {
        navigate('/user');
      } else {
        navigate('/');
      }
      
    } catch (error) {
      setErrors({ general: error.message || 'Login failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Firebase Google login
      await signInWithPopup(auth, googleProvider);
      const token = await auth.currentUser.getIdToken();
      localStorage.setItem('jwt', token); // Store token for API use
      // Optionally, fetch user type from backend and redirect accordingly
      navigate('/'); // or your dashboard route
      
    } catch (error) {
      setErrors({ general: error.message || 'Google login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      component="form"
      onSubmit={handleEmailLogin}
      sx={{
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper'
      }}
    >
      <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
        Sign In
      </Typography>
      
      <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back! Please sign in to your account
      </Typography>

      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      {/* Google Sign In Button */}
      <Button
        fullWidth
        variant="outlined"
        size="large"
        startIcon={<Google />}
        onClick={handleGoogleLogin}
        disabled={isLoading}
        sx={{
          mb: 2,
          py: 1.5,
          borderColor: '#db4437',
          color: '#db4437',
          '&:hover': {
            borderColor: '#db4437',
            bgcolor: 'rgba(219, 68, 55, 0.04)'
          }
        }}
      >
        Continue with Google
      </Button>

      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>

      {/* Email Field */}
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

      {/* Password Field */}
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

      {/* Forgot Password Link */}
      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={() => {
            // TODO: Navigate to forgot password page
            console.log('Forgot password clicked');
          }}
          disabled={isLoading}
        >
          Forgot your password?
        </Link>
      </Box>

      {/* Sign In Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{
          py: 1.5,
          mb: 2,
          bgcolor: '#1976d2',
          '&:hover': {
            bgcolor: '#1565c0'
          }
        }}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>

      {/* Sign Up Link */}
      <Typography variant="body2" textAlign="center">
        Don't have an account?{' '}
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
    </Box>
  );
};

export default Login;