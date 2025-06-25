import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider,
  Grid,
  Paper,
  Fade
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  PhotoCamera,
  Person,
  Email,
  Phone,
  Lock,
  LocationOn,
  Upload
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Country, State, City } from 'country-state-city';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../../utils/firebase';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

// Glassmorphic + 3D glow style (same as LoginPage)
const glass3DGlowStyle = (theme) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(26,34,63,0.92)'
    : 'rgba(255,255,255,0.92)',
  boxShadow: `
    0 8px 32px 0 rgba(58,134,255,0.10),
    0 1.5px 8px 0 rgba(26,34,63,0.10),
    0 2px 24px 0 rgba(58,134,255,0.10),
    0 0.5px 1.5px 0 rgba(255,255,255,0.18) inset,
    0 0 32px 8px #3a86ff44,
    0 24px 48px 0 #1a223f11
  `,
  backdropFilter: 'blur(18px) saturate(180%)',
  borderRadius: '28px',
  border: '1.5px solid rgba(255,255,255,0.13)',
  overflow: 'hidden',
  position: 'relative',
  transform: 'translateZ(0)',
  transition: 'box-shadow 0.3s'
});

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
        width: 280,
        height: 280,
        zIndex: 0,
        filter: 'blur(60px)',
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
        bottom: '-60px',
        right: '-60px',
        width: 160,
        height: 160,
        zIndex: 0,
        background: 'radial-gradient(circle at 40% 60%, #1a223f33 0%, #3a86ff55 100%)',
        filter: 'blur(40px)',
        borderRadius: '50%',
        boxShadow: '0 0 32px 8px #36f1cd33',
        opacity: 0.5,
      }}
    />
  </>
);

const RegisterPage = ({ prefill = {}, isCompleteRegistration = false }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: prefill.firstName || '',
    lastName: prefill.lastName || '',
    gender: '',
    dateOfBirth: '',
    email: prefill.email || '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    profilePicture: null
  });

  useEffect(() => {
    setFormData(prev => {
      // Only update if prefill values are different
      let changed = false;
      const updated = { ...prev };
      for (const key in prefill) {
        if (prefill[key] && prefill[key] !== prev[key]) {
          updated[key] = prefill[key];
          changed = true;
        }
      }
      return changed ? updated : prev;
    });
  }, [prefill]);

  // Merge Personal Info + Contact
  const steps = ['Basic Info', 'Security', 'Location', 'Profile Picture'];
  const stepDescriptions = [
    "Tell us about yourself and how we can contact you.",
    "Set a secure password.",
    "Where are you located?",
    "Add a profile picture (optional)."
  ];
  const countries = Country.getAllCountries();
  const states = formData.country ? State.getStatesOfCountry(formData.country) : [];
  const cities = formData.state ? City.getCitiesOfState(formData.country, formData.state) : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'country') {
      setFormData(prev => ({
        ...prev,
        country: value,
        state: '',
        city: ''
      }));
    } else if (name === 'state') {
      setFormData(prev => ({
        ...prev,
        state: value,
        city: ''
      }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Update validation logic for new step order
  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 0: // Basic Info
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Please enter a valid phone number';
        break;
      case 1: // Security
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) newErrors.password = 'Password must contain uppercase, lowercase, and number';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        break;
      case 2:
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.state) newErrors.state = 'State/Province is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.pincode) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{4,10}$/.test(formData.pincode)) newErrors.pincode = 'Please enter a valid pincode';
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;
    setIsLoading(true);
    try {
      let idToken;
      if (isCompleteRegistration) {
        // Use JWT from localStorage (from Google sign-in)
        idToken = localStorage.getItem('jwt');
      } else {
        // Normal registration: create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;
        idToken = await user.getIdToken();
      }

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'profilePicture' && value) data.append('profilePicture', value);
        else if (value) data.append(key, value);
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${idToken}` },
        body: data,
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Registration failed');
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      setErrors({ general: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
      setErrors({ general: error.message || 'Google sign up failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Info
        return (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} minWidth='180px' sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  placeholder="Enter your first name"
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item item xs={12} minWidth='180px' sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>



              <Grid item item xs={12} minWidth='180px' sx={{ mb: 2 }}>
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
                  placeholder="Enter your email address"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} minWidth='180px' sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                  disabled={isLoading}
                  placeholder="Enter your phone number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} minWidth='235px' sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                  disabled={isLoading}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} minWidth='235px' sx={{ mb: 2 }}>
                <FormControl fullWidth error={!!errors.gender} disabled={isLoading}>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    label="Gender"
                    onChange={handleChange}
                    displayEmpty
                    renderValue={(selected) =>
                      selected ? selected.charAt(0).toUpperCase() + selected.slice(1) : <em>Select your gender</em>
                    }
                  >
                    <MenuItem disabled value="">
                      <em>Select your gender</em>
                    </MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                  </Select>
                  {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                </FormControl>

              </Grid>

            </Grid>
          </Box>
        );

      case 1: // Security
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} minWidth='480px' sx={{ mb: 2 }}>
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
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} minWidth='480px' sx={{ mb: 2 }}>
              <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Password must contain at least 8 characters with uppercase, lowercase, and number
              </Typography>
            </Grid>
          </Grid>
        );
      case 2: // Location
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} minWidth='180px' sx={{ mb: 2 }}>
              <FormControl fullWidth error={!!errors.country}>
                <InputLabel>Country</InputLabel>
                <Select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={isLoading}
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationOn color="action" />
                    </InputAdornment>
                  }
                >
                  {countries.map((country) => (
                    <MenuItem key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.country && (
                  <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                    {errors.country}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} minWidth='180px' sx={{ mb: 2 }}>
              <FormControl fullWidth error={!!errors.state}>
                <InputLabel>State/Province</InputLabel>
                <Select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={isLoading || !formData.country}
                >
                  {states.map((state) => (
                    <MenuItem key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.state && (
                  <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                    {errors.state}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} minWidth='180px' sx={{ mb: 2 }}>
              <TextField
                fullWidth
                name="pincode"
                label="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                error={!!errors.pincode}
                helperText={errors.pincode}
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} minWidth='180px' sx={{ mb: 2 }}>
              <FormControl fullWidth error={!!errors.city}>
                <InputLabel>City</InputLabel>
                <Select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isLoading || !formData.state}
                >
                  {cities.map((city) => (
                    <MenuItem key={city.name} value={city.name}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.city && (
                  <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                    {errors.city}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );
      case 3: // Profile Picture
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Avatar
              src={imagePreview}
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                bgcolor: 'grey.200',
                fontSize: '2.5rem',
                boxShadow: '0 0 24px 6px #3a86ff33, 0 4px 16px 0 #36f1cd22'
              }}
            >
              {!imagePreview && <PhotoCamera sx={{ fontSize: '2.5rem' }} />}
            </Avatar>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-image-upload"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="profile-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<Upload />}
                disabled={isLoading}
                sx={{ mb: 2 }}
              >
                Upload Profile Picture
              </Button>
            </label>
            <Typography variant="body2" color="text.secondary">
              Choose a profile picture (optional). You can skip this step and add it later.
            </Typography>
            {profileImage && (
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                Selected: {profileImage.name}
              </Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

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
            maxWidth: 600,
            width: '100%',
            mx: 'auto',
            p: { xs: 1, sm: 2, md: 3 },
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: { xs: 'none', md: 'perspective(900px) rotateX(1.5deg) scale(1.01)' },
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
          onSubmit={e => { e.preventDefault(); activeStep === steps.length - 1 ? handleSubmit() : handleNext(); }}
        >
          <Typography
            variant="h5"
            fontWeight={900}
            sx={{
              color: theme.palette.primary.main,
              mb: 1,
              letterSpacing: '-1.2px',
              textShadow: '0 2px 12px #3a86ff22'
            }}
          >
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
            Join CrowdFundNext and start your crowdfunding journey
          </Typography>

          {errors.general && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {errors.general}
            </Alert>
          )}

          {/* Google Sign Up Button - Show only on first step */}
          {activeStep === 0 && (
            <>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Google />}
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                sx={{
                  mb: 2,
                  py: 1.2,
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
                Sign up with Google
              </Button>
              <Divider sx={{ my: 2, width: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>
            </>
          )}

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 3, width: '100%' }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="body2" fontWeight={600} sx={{ letterSpacing: 0 }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          <Box sx={{ width: '100%', mb: 2 }}>
            {renderStepContent(activeStep)}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>
            <Button
              disabled={activeStep === 0 || isLoading}
              onClick={handleBack}
              variant="outlined"
              size="small"
            >
              Back
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading}
              size="small"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.getContrastText(theme.palette.primary.main),
                fontWeight: 700,
                px: 3,
                py: 1,
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.getContrastText(theme.palette.secondary.main),
                }
              }}
            >
              {isLoading
                ? 'Processing...'
                : activeStep === steps.length - 1
                  ? 'Create Account'
                  : 'Next'
              }
            </Button>
          </Box>

          {/* Sign In Link */}
          <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Button
              variant="text"
              onClick={() => navigate('/login')}
              disabled={isLoading}
              sx={{ fontWeight: 'bold', textTransform: 'none', fontSize: '1rem' }}
            >
              Sign in here
            </Button>
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Step {activeStep + 1} of {steps.length}
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default RegisterPage;