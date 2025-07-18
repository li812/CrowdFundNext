import React, { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, MenuItem, Grid, IconButton, Stack, Chip, InputAdornment, Alert, Fade, Switch, FormControlLabel, RadioGroup, Radio, FormControl, FormLabel
} from '@mui/material';
import { PhotoCamera, UploadFile, Link as LinkIcon, Delete, AccessTime, AutoAwesome } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import AIGenerateModal from '../../components/Card/CampainCard/AIGenerateModal';

const CAMPAIGN_TYPES = [
  'Tech', 'Education', 'Health', 'Art', 'Social Good', 'Environment', 'Startups', 'Student Life', 'Others'
];

const MAX_TITLE = 25;
const MAX_DESC = 250;
const MAX_PHOTOS = 5;
const MAX_LINKS = 5;

// Glassmorphic + 3D glow style (matches Register/Login)
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

// Animated glassy 3D glow blobs (optional, but matches Register/Login)
const AnimatedBg = () => {
  const theme = useTheme();
  return (
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
};

function UserPostCampaign() {
  const theme = useTheme();
  const [form, setForm] = useState({
    type: '',
    title: '',
    description: '',
    amount: '',
    photos: [],
    supportDoc: null,
    links: [''],
    // Time period configuration
    hasTimeLimit: false,
    timeLimitType: 'fixed',
    endDate: '',
    maxDuration: 30
  });
  const [errors, setErrors] = useState({});
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [supportDocName, setSupportDocName] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Validation
  const validate = () => {
    const errs = {};
    if (!form.type) errs.type = 'Type is required';
    if (!form.title) errs.title = 'Title is required';
    else if (form.title.length > MAX_TITLE) errs.title = `Max ${MAX_TITLE} characters`;
    if (!form.description) errs.description = 'Description is required';
    else if (form.description.length > MAX_DESC) errs.description = `Max ${MAX_DESC} characters`;
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (form.photos.length > MAX_PHOTOS) errs.photos = `Max ${MAX_PHOTOS} photos`;
    if (form.links.some(link => link && !/^https?:\/\/.+\..+/.test(link))) errs.links = 'Enter valid URLs';
    if (form.links.length > MAX_LINKS) errs.links = `Max ${MAX_LINKS} links`;
    
    // Time period validation
    if (form.hasTimeLimit) {
      if (form.timeLimitType === 'fixed' && !form.endDate) {
        errs.endDate = 'End date is required for fixed time limit campaigns';
      } else if (form.timeLimitType === 'fixed' && form.endDate) {
        const endDate = new Date(form.endDate);
        const now = new Date();
        if (endDate <= now) {
          errs.endDate = 'End date must be in the future';
        }
        const daysDiff = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        if (daysDiff > 365) {
          errs.endDate = 'Campaign duration cannot exceed 365 days';
        }
        if (daysDiff < 1) {
          errs.endDate = 'Campaign must run for at least 1 day';
        }
      }
      
      if (form.timeLimitType === 'flexible') {
        if (form.maxDuration < 1 || form.maxDuration > 365) {
          errs.maxDuration = 'Maximum duration must be between 1 and 365 days';
        }
      }
    }
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: undefined }));
  };

  const handleTimeLimitChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ 
      ...f, 
      [name]: type === 'checkbox' ? checked : value,
      // Reset related fields when time limit is disabled
      ...(name === 'hasTimeLimit' && !checked && {
        timeLimitType: 'fixed',
        endDate: '',
        maxDuration: 30
      })
    }));
    setErrors(e => ({ ...e, [name]: undefined }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    // Combine with existing photos, but limit to MAX_PHOTOS
    const newPhotos = [...form.photos, ...files].slice(0, MAX_PHOTOS);
    setForm(f => ({ ...f, photos: newPhotos }));
    setPhotoPreviews(newPhotos.map(file => URL.createObjectURL(file)));
    setErrors(e => ({ ...e, photos: undefined }));
  };

  const handleRemovePhoto = (idx) => {
    const newPhotos = [...form.photos];
    newPhotos.splice(idx, 1);
    setForm(f => ({ ...f, photos: newPhotos }));
    setPhotoPreviews(newPhotos.map(file => URL.createObjectURL(file)));
  };

  const handleSupportDoc = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setForm(f => ({ ...f, supportDoc: file }));
      setSupportDocName(file.name);
      setErrors(e => ({ ...e, supportDoc: undefined }));
    } else {
      setErrors(e => ({ ...e, supportDoc: 'Only PDF allowed' }));
    }
  };

  const handleLinkChange = (idx, value) => {
    const newLinks = [...form.links];
    newLinks[idx] = value;
    setForm(f => ({ ...f, links: newLinks }));
    setErrors(e => ({ ...e, links: undefined }));
  };

  const handleAddLink = () => {
    if (form.links.length < MAX_LINKS) setForm(f => ({ ...f, links: [...f.links, ''] }));
  };

  const handleRemoveLink = (idx) => {
    const newLinks = [...form.links];
    newLinks.splice(idx, 1);
    setForm(f => ({ ...f, links: newLinks }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('type', form.type);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('amountNeeded', form.amount);
    
    // Time period data
    formData.append('hasTimeLimit', form.hasTimeLimit);
    if (form.hasTimeLimit) {
      formData.append('timeLimitType', form.timeLimitType);
      if (form.timeLimitType === 'fixed') {
        formData.append('endDate', form.endDate);
      } else if (form.timeLimitType === 'flexible') {
        formData.append('maxDuration', form.maxDuration);
      }
    }

    // Photos
    form.photos.forEach(photo => {
      formData.append('photos', photo);
    });

    // Support Document
    if (form.supportDoc) {
      formData.append('supportDoc', form.supportDoc);
    }

    // Links
    form.links
      .filter(link => link && link.trim())
      .forEach(link => formData.append('links', link));

    setErrors({});
    setSubmitSuccess(false);

    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors({ general: data.error || 'Failed to submit campaign.' });
        return;
      }
      setSubmitSuccess(true);
      // Reset form
      setForm({
        type: '',
        title: '',
        description: '',
        amount: '',
        photos: [],
        supportDoc: null,
        links: [''],
        hasTimeLimit: false,
        timeLimitType: 'fixed',
        endDate: '',
        maxDuration: 30
      });
      setPhotoPreviews([]);
      setSupportDocName('');
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      setErrors({ general: err.message || 'Failed to submit campaign.' });
    }
  };

  // Calculate minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Calculate maximum date (1 year from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 365);
    return maxDate.toISOString().split('T')[0];
  };

  const handleAIGenerate = () => {
    setAiModalOpen(true);
  };

  const handleAISelect = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
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
            maxWidth: 700,
            width: '100%',
            mx: 'auto',
            p: { xs: 2, sm: 4 },
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: { xs: 'none', md: 'perspective(900px) rotateX(1.5deg) scale(1.01)' }
          }}
          component={motion.form}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          onSubmit={handleSubmit}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 2 }}>
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                color: theme.palette.primary.main,
                letterSpacing: '-1.2px',
                textShadow: '0 2px 12px #3a86ff22'
              }}
            >
              Start a New Campaign
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AutoAwesome />}
              onClick={handleAIGenerate}
              sx={{
                borderRadius: 2,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: theme.palette.primary.main + '10'
                }
              }}
            >
              Generate with AI
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
            Fill in the details below. Your campaign will be reviewed by an admin before going live.
          </Typography>
          
          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Campaign submitted! Awaiting admin approval.
            </Alert>
          )}
          {errors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.general}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            {/* Type */}
            <Grid item xs={12} minWidth='180px' sx={{ mb: 2 }}>
              <TextField
                select
                label="Type of Campaign"
                name="type"
                value={form.type}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.type}
                helperText={errors.type}
              >
                {CAMPAIGN_TYPES.map(type => (
                  <MenuItem minWidth='120px' key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Title */}
            <Grid item xs={12} minWidth='500px'>
              <TextField
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ maxLength: MAX_TITLE }}
                error={!!errors.title}
                helperText={errors.title || `${form.title.length}/${MAX_TITLE}`}
              />
            </Grid>
            
            {/* Description */}
            <Grid item xs={12} minWidth='500px'>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                required
                multiline
                minRows={3}
                inputProps={{ maxLength: MAX_DESC }}
                error={!!errors.description}
                helperText={errors.description || `${form.description.length}/${MAX_DESC}`}
              />
            </Grid>

            {/* Amount */}
            <Grid item xs={12} minWidth='500px'>
              <TextField
                label="Amount Needed"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                fullWidth
                required
                type="number"
                inputProps={{ min: 1 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                error={!!errors.amount}
                helperText={errors.amount}
              />
            </Grid>

            {/* Time Period Configuration */}
            <Grid item xs={12}>
              <Box sx={{ 
                border: `1px solid ${theme.palette.divider}`, 
                borderRadius: 2, 
                p: 2, 
                bgcolor: 'background.paper' 
              }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <AccessTime color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Campaign Duration
                  </Typography>
                </Stack>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.hasTimeLimit}
                      onChange={handleTimeLimitChange}
                      name="hasTimeLimit"
                      color="primary"
                    />
                  }
                  label="Set a time limit for this campaign"
                  sx={{ mb: 2 }}
                />
                
                {form.hasTimeLimit && (
                  <Box sx={{ ml: 4 }}>
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                      <FormLabel component="legend">Time Limit Type</FormLabel>
                      <RadioGroup
                        name="timeLimitType"
                        value={form.timeLimitType}
                        onChange={handleTimeLimitChange}
                        row
                      >
                        <FormControlLabel 
                          value="fixed" 
                          control={<Radio />} 
                          label="Fixed End Date" 
                        />
                        <FormControlLabel 
                          value="flexible" 
                          control={<Radio />} 
                          label="Flexible (Until Goal Reached)" 
                        />
                      </RadioGroup>
                    </FormControl>
                    
                    {form.timeLimitType === 'fixed' && (
                      <TextField
                        label="End Date"
                        name="endDate"
                        type="date"
                        value={form.endDate}
                        onChange={handleTimeLimitChange}
                        fullWidth
                        required
                        inputProps={{
                          min: getMinDate(),
                          max: getMaxDate()
                        }}
                        error={!!errors.endDate}
                        helperText={errors.endDate || "Campaign will end on this date regardless of funding progress"}
                      />
                    )}
                    
                    {form.timeLimitType === 'flexible' && (
                      <TextField
                        label="Maximum Duration (days)"
                        name="maxDuration"
                        type="number"
                        value={form.maxDuration}
                        onChange={handleTimeLimitChange}
                        fullWidth
                        required
                        inputProps={{ min: 1, max: 365 }}
                        error={!!errors.maxDuration}
                        helperText={errors.maxDuration || "Campaign will continue until goal is reached or this duration is exceeded"}
                      />
                    )}
                  </Box>
                )}
                
                {!form.hasTimeLimit && (
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Campaign will run indefinitely until manually stopped or goal is reached.
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Photos */}
            <Grid item xs={12} minWidth='200px'>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Photos (optional, up to 5)</Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap' }}>
                {photoPreviews.map((src, idx) => (
                  <Box key={idx} sx={{ position: 'relative', display: 'inline-block' }}>
                    <img src={src} alt={`preview-${idx}`} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: '2px solid #3a86ff44' }} />
                    <IconButton
                      size="small"
                      onClick={() => handleRemovePhoto(idx)}
                      sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'white', color: 'red' }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                {form.photos.length < MAX_PHOTOS && (
                  <>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handlePhotoChange}
                    />
                    <label htmlFor="photo-upload">
                      <IconButton color="primary" component="span" sx={{ border: '1.5px dashed #3a86ff', bgcolor: 'rgba(58,134,255,0.07)' }}>
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </>
                )}
              </Stack>
              {errors.photos && <Typography color="error" variant="caption">{errors.photos}</Typography>}
            </Grid>

            {/* Support Document */}
            <Grid item xs={12} minWidth='200px'>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Support Document (PDF, optional)</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <input
                  id="support-doc-upload"
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={handleSupportDoc}
                />
                <label htmlFor="support-doc-upload">
                  <Button
                    variant="outlined"
                    startIcon={<UploadFile />}
                    component="span"
                  >
                    {supportDocName ? 'Change PDF' : 'Upload PDF'}
                  </Button>
                </label>
                {supportDocName && (
                  <Chip
                    label={supportDocName}
                    onDelete={() => { setForm(f => ({ ...f, supportDoc: null })); setSupportDocName(''); }}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Stack>
              {errors.supportDoc && <Typography color="error" variant="caption">{errors.supportDoc}</Typography>}
            </Grid>
            
            {/* URL Links */}
            <Grid item xs={12} minWidth='500px'>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>URL Links (optional, up to 5)</Typography>
              <Stack spacing={1}>
                {form.links.map((link, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      label={`Link ${idx + 1}`}
                      value={link}
                      onChange={e => handleLinkChange(idx, e.target.value)}
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LinkIcon /></InputAdornment>
                      }}
                      error={!!errors.links && typeof errors.links === 'string'}
                    />
                    {form.links.length > 1 && (
                      <IconButton onClick={() => handleRemoveLink(idx)} color="error">
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                ))}
                {form.links.length < MAX_LINKS && (
                  <Button onClick={handleAddLink} size="small" sx={{ mt: 1 }}>
                    + Add another link
                  </Button>
                )}
                {errors.links && <Typography color="error" variant="caption">{errors.links}</Typography>}
              </Stack>
            </Grid>
            
            {/* Submit */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  borderRadius: 2.5,
                  py: 1.5,
                  mt: 2,
                  boxShadow: '0 4px 24px 0 #3a86ff22'
                }}
              >
                Submit Campaign
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {/* AI Generate Modal */}
      <AIGenerateModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onSelect={handleAISelect}
      />
    </Box>
  );
}

export default UserPostCampaign;