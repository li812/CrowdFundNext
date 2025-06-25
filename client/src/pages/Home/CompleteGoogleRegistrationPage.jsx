import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Alert, Paper, Grid, Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CompleteGoogleRegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    gender: '', dateOfBirth: '', phoneNumber: '', country: '', state: '', city: '', pincode: '', profilePicture: null
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Prefill from Google JWT
    const token = localStorage.getItem('jwt');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setFormData(prev => ({
        ...prev,
        email: payload.email || '',
        firstName: payload.name?.split(' ')[0] || '',
        lastName: payload.name?.split(' ')[1] || '',
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name required';
    if (!formData.lastName) newErrors.lastName = 'Last name required';
    if (!formData.email) newErrors.email = 'Email required';
    if (!formData.password) newErrors.password = 'Password required';
    else if (formData.password.length < 8) newErrors.password = 'Min 8 chars';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    // Add more field checks as needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k === 'profilePicture' && v) data.append('profilePicture', v);
        else if (v) data.append(k, v);
      });
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'Registration failed');
      alert('Registration complete! You can now log in.');
      navigate('/login');
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ maxWidth: 500, width: '100%', p: 4 }}>
        <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>Complete Your Registration</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>Please fill in the missing details and set a password.</Typography>
        {errors.general && <Alert severity="error" sx={{ mb: 2 }}>{errors.general}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} fullWidth error={!!errors.firstName} helperText={errors.firstName} />
            </Grid>
            <Grid item xs={6}>
              <TextField name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} fullWidth error={!!errors.lastName} helperText={errors.lastName} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="email" label="Email" value={formData.email} disabled fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField name="password" label="Password" type="password" value={formData.password} onChange={handleChange} fullWidth error={!!errors.password} helperText={errors.password} />
            </Grid>
            <Grid item xs={6}>
              <TextField name="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} fullWidth error={!!errors.confirmPassword} helperText={errors.confirmPassword} />
            </Grid>
            {/* Add more fields as needed, e.g. gender, dob, phone, etc */}
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Profile Picture
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </Button>
              {imagePreview && <Avatar src={imagePreview} sx={{ width: 56, height: 56, mt: 1 }} />}
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Complete Registration'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CompleteGoogleRegistrationPage;