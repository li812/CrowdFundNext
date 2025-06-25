import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem, Typography, Stack, IconButton, Chip, InputAdornment, Alert, CircularProgress
} from '@mui/material';
import { PhotoCamera, UploadFile, Link as LinkIcon, Delete } from '@mui/icons-material';

const CAMPAIGN_TYPES = [
  'Tech', 'Education', 'Health', 'Art', 'Social Good', 'Environment', 'Startups', 'Student Life', 'Others'
];
const MAX_TITLE = 25;
const MAX_DESC = 250;
const MAX_PHOTOS = 5;
const MAX_LINKS = 5;

function EditCampaignModal({ open, campaign, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    type: '',
    title: '',
    description: '',
    amount: '',
    photos: [],
    supportDoc: null,
    links: ['']
  });
  const [errors, setErrors] = useState({});
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [supportDocName, setSupportDocName] = useState('');
  const [removeSupportDoc, setRemoveSupportDoc] = useState(false);

  useEffect(() => {
    if (campaign) {
      setForm({
        type: campaign.type || '',
        title: campaign.title || '',
        description: campaign.description || '',
        amount: campaign.amountNeeded || '',
        photos: campaign.photos ? [...campaign.photos] : [],
        supportDoc: null,
        links: campaign.links && campaign.links.length > 0 ? [...campaign.links] : ['']
      });
      setPhotoPreviews(
        campaign.photos && campaign.photos.length > 0
          ? campaign.photos.map(photo => photo.startsWith('http') ? photo : `${import.meta.env.VITE_API_URL}${photo}`)
          : []
      );
      setSupportDocName(campaign.supportDocument ? campaign.supportDocument.split('/').pop() : '');
      setRemoveSupportDoc(false);
    }
  }, [campaign]);

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
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: undefined }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = [...form.photos, ...files].slice(0, MAX_PHOTOS);
    setForm(f => ({ ...f, photos: newPhotos }));
    setPhotoPreviews(newPhotos.map(file =>
      typeof file === 'string' ? (file.startsWith('http') ? file : `${import.meta.env.VITE_API_URL}${file}`) : URL.createObjectURL(file)
    ));
    setErrors(e => ({ ...e, photos: undefined }));
  };

  const handleRemovePhoto = (idx) => {
    const newPhotos = [...form.photos];
    newPhotos.splice(idx, 1);
    setForm(f => ({ ...f, photos: newPhotos }));
    setPhotoPreviews(newPhotos.map(file =>
      typeof file === 'string' ? (file.startsWith('http') ? file : `${import.meta.env.VITE_API_URL}${file}`) : URL.createObjectURL(file)
    ));
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

  const handleRemoveSupportDoc = () => {
    setForm(f => ({ ...f, supportDoc: null }));
    setSupportDocName('');
    setRemoveSupportDoc(true);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const clearPhotos = form.photos.length === 0;
    onSubmit(form, removeSupportDoc, clearPhotos);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth aria-labelledby="edit-campaign-dialog">
      <DialogTitle id="edit-campaign-dialog">Edit Campaign</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Type */}
            <Grid item xs={12} minWidth='180px'>
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
            {/* Photos */}
            <Grid item xs={12} minWidth='200px'>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Photos (optional, up to 5)</Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap' }}>
                {photoPreviews.map((src, idx) => (
                  <span key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={src} alt={`preview-${idx}`} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: '2px solid #3a86ff44' }} />
                    <IconButton
                      size="small"
                      onClick={() => handleRemovePhoto(idx)}
                      sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'white', color: 'red' }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </span>
                ))}
                {form.photos.length < MAX_PHOTOS && (
                  <>
                    <input
                      id="photo-upload-edit"
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handlePhotoChange}
                    />
                    <label htmlFor="photo-upload-edit">
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
                  id="support-doc-upload-edit"
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={handleSupportDoc}
                />
                <label htmlFor="support-doc-upload-edit">
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
                    onDelete={handleRemoveSupportDoc}
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
                  <span key={idx} style={{ display: 'flex', alignItems: 'center' }}>
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
                  </span>
                ))}
                {form.links.length < MAX_LINKS && (
                  <Button onClick={handleAddLink} size="small" sx={{ mt: 1 }}>
                    + Add another link
                  </Button>
                )}
                {errors.links && <Typography color="error" variant="caption">{errors.links}</Typography>}
              </Stack>
            </Grid>
            {/* Error/Loading */}
            <Grid item xs={12}>
              {errors.general && <Alert severity="error" sx={{ mb: 2 }}>{errors.general}</Alert>}
              {loading && <CircularProgress size={28} sx={{ ml: 2 }} />}
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          Update Campaign
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditCampaignModal; 