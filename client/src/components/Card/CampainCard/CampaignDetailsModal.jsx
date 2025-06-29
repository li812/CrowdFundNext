import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Stack, Chip, LinearProgress, IconButton, Link as MuiLink
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, PictureAsPdf, Link as LinkIcon } from '@mui/icons-material';

function CampaignDetailsModal({ open, campaign, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);
  if (!campaign) return null;
  const photos = campaign.photos && campaign.photos.length > 0 ? campaign.photos : [];
  const photoUrl = photos.length > 0
    ? (photos[imgIdx].startsWith('http') ? photos[imgIdx] : `${import.meta.env.VITE_API_URL}${photos[imgIdx]}`)
    : 'https://via.placeholder.com/400x200?text=No+Image';
  const progress = Math.min(100, Math.round((campaign.amountReceived / campaign.amountNeeded) * 100));

  // Carousel controls
  const handlePrev = (e) => {
    e.stopPropagation();
    setImgIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };
  const handleNext = (e) => {
    e.stopPropagation();
    setImgIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: { xs: '95vw', sm: 700, md: 900 },
          width: '100%',
          m: 0,
        }
      }}
    >
      <DialogTitle>Campaign Details</DialogTitle>
      <DialogContent sx={{ p: { xs: 1, sm: 3 }, maxHeight: '80vh', overflowY: 'auto' }}>
        <Stack spacing={2}>
          {/* Photo carousel */}
          <Box sx={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2,
            minHeight: { xs: 180, sm: 240 },
            maxHeight: { xs: 220, sm: 320 },
          }}>
            <img
              src={photoUrl}
              alt={campaign.title}
              style={{
                width: '100%',
                maxWidth: 520,
                height: 'auto',
                maxHeight: 320,
                objectFit: 'cover',
                borderRadius: 8,
                margin: '0 auto',
                display: 'block',
                boxShadow: '0 2px 16px 0 #3a86ff22',
              }}
            />
            {photos.length > 1 && (
              <>
                <IconButton
                  size="small"
                  onClick={handlePrev}
                  sx={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.7)' }}
                >
                  <ArrowBackIos fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleNext}
                  sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.7)' }}
                >
                  <ArrowForwardIos fontSize="small" />
                </IconButton>
                {/* Indicators */}
                <Box sx={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 1 }}>
                  {photos.map((_, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        width: 10, height: 10, borderRadius: '50%',
                        bgcolor: idx === imgIdx ? 'primary.main' : 'grey.400',
                        border: idx === imgIdx ? '2px solid #fff' : 'none',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </Box>
              </>
            )}
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={campaign.type} color="primary" size="small" />
            {campaign.status && <Chip label={campaign.status} color="info" size="small" />}
          </Stack>
          <Typography variant="h5" fontWeight={700}>{campaign.title}</Typography>
          <Typography variant="body1" color="text.secondary">{campaign.description}</Typography>
          <Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={progress === 100 ? 'success' : 'primary'}
              sx={{ height: 17, borderRadius: 4, mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              ${campaign.amountReceived} raised of ${campaign.amountNeeded} goal ({progress}%)
            </Typography>
          </Box>
          {/* Links */}
          {campaign.links && campaign.links.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {campaign.links.map((link, idx) => (
                <Button
                  key={idx}
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<LinkIcon />}
                  component={MuiLink}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textTransform: 'none', mb: 0.5 }}
                >
                  Link {idx + 1}
                </Button>
              ))}
            </Stack>
          )}
          {/* Support Document */}
          {campaign.supportDocument && (
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              startIcon={<PictureAsPdf />}
              component={MuiLink}
              href={campaign.supportDocument.startsWith('http') ? campaign.supportDocument : `${import.meta.env.VITE_API_URL}${campaign.supportDocument}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textTransform: 'none', mb: 1 }}
            >
              View Support Document
            </Button>
          )}
          
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CampaignDetailsModal; 