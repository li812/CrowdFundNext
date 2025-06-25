import React, { useState } from 'react';
import {
  Card, CardContent, CardMedia, Typography, Box, Button, Chip, Stack, LinearProgress, IconButton, Tooltip, Link as MuiLink
} from '@mui/material';
import { Edit, Delete, AttachMoney, Info, ArrowBackIos, ArrowForwardIos, PictureAsPdf, Link as LinkIcon } from '@mui/icons-material';

function CampaignCard({
  campaign,
  mode = 'other',
  onEdit,
  onDelete,
  onDonate,
  onViewDetails
}) {
  // Carousel state
  const [imgIdx, setImgIdx] = useState(0);
  const photos = campaign.photos && campaign.photos.length > 0 ? campaign.photos : [];
  const photoUrl = photos.length > 0
    ? (photos[imgIdx].startsWith('http') ? photos[imgIdx] : `${import.meta.env.VITE_API_URL}${photos[imgIdx]}`)
    : 'https://via.placeholder.com/400x200?text=No+Image';

  // Progress calculation
  const progress = Math.min(
    100,
    Math.round((campaign.amountReceived / campaign.amountNeeded) * 100)
  );

  // Status color
  const statusColor =
    campaign.status === 'approved' ? 'success' :
    campaign.status === 'pending' ? 'warning' :
    campaign.status === 'rejected' ? 'error' : 'default';

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
    <Card sx={{
      maxWidth: 350,
      minWidth: 350,
      width: '100%',
      maxHeight: 680,
      minHeight: 680,
      display: 'flex',
      flexDirection: 'column',
      m: 2,
      position: 'relative',
      borderRadius: 2,
      boxShadow: 3,
      overflow: 'hidden',
    }}>
      <Box sx={{ position: 'relative', cursor: 'pointer', height: 280, minHeight: 280, maxHeight: 280, overflow: 'hidden' }} onClick={onViewDetails}>
        <CardMedia
          component="img"
          height="180"
          image={photoUrl}
          alt={campaign.title}
          sx={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
        {/* Carousel controls */}
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
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, height: '100%' }}>
        <Box sx={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Chip label={campaign.type} color="primary" size="small" />
            {mode === 'mine' && (
              <Chip label={campaign.status} color={statusColor} size="small" />
            )}
          </Stack>
          <Typography variant="h6" fontWeight={700} gutterBottom noWrap>{campaign.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} >
            {campaign.description}
          </Typography>
          <Box sx={{ mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={progress === 100 ? 'success' : 'primary'}
              sx={{ height: 17, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary">
              ${campaign.amountReceived} raised of ${campaign.amountNeeded} goal ({progress}%)
            </Typography>
          </Box>
          {/* Links */}
          {campaign.links && campaign.links.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
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
          {mode === 'mine' && campaign.status === 'rejected' && campaign.adminComment && (
            <Typography variant="caption" color="error" sx={{ mb: 1, display: 'block' }}>
              Admin: {campaign.adminComment}
            </Typography>
          )}
        </Box>
        <Box sx={{ mt: 1 }}>
          <Stack direction="row" spacing={1}>
            {mode === 'mine' && campaign.status !== 'approved' && (
              <>
                <Tooltip title="Edit">
                  <IconButton color="primary" onClick={onEdit}><Edit /></IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={onDelete}><Delete /></IconButton>
                </Tooltip>
              </>
            )}
            {mode === 'other' && campaign.status === 'approved' && (
              <Button
                variant="contained"
                color="success"
                startIcon={<AttachMoney />}
                onClick={onDonate}
                size="small"
              >
                Donate
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<Info />}
              onClick={onViewDetails}
              size="small"
            >
              Details
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CampaignCard;