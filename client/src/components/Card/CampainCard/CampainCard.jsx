import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, CardMedia, Typography, Box, Button, Chip, Stack, LinearProgress, IconButton, Tooltip, Link as MuiLink, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress
} from '@mui/material';
import { Edit, Delete, AttachMoney, Info, ArrowBackIos, ArrowForwardIos, PictureAsPdf, Link as LinkIcon, Lock, Share, FavoriteBorder, Favorite, ChatBubbleOutline } from '@mui/icons-material';

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

  // Like/comment state
  const [likeCount, setLikeCount] = useState(campaign.likes ? campaign.likes.length : 0);
  const [liked, setLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(campaign.comments ? campaign.comments.length : 0);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Check if current user liked this campaign
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (campaign.likes && userId) {
      setLiked(campaign.likes.includes(userId));
    }
    setLikeCount(campaign.likes ? campaign.likes.length : 0);
    setCommentCount(campaign.comments ? campaign.comments.length : 0);
  }, [campaign.likes, campaign.comments]);

  // Like/unlike handler
  const handleLike = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('jwt');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/${campaign._id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      }
    } catch { }
  };

  // Comment modal handlers
  const openCommentModal = (e) => { e.stopPropagation(); setCommentModalOpen(true); fetchComments(); };
  const closeCommentModal = () => { setCommentModalOpen(false); setCommentText(''); setCommentError(''); };
  const fetchComments = async () => {
    setCommentLoading(true);
    setCommentError('');
    const token = localStorage.getItem('jwt');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/${campaign._id}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setComments(data.comments);
      setCommentCount(data.comments.length);
    } catch (err) {
      setCommentError('Failed to load comments');
    } finally {
      setCommentLoading(false);
    }
  };
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    setCommentError('');
    const token = localStorage.getItem('jwt');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/${campaign._id}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: commentText })
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => [...prev, data.comment]);
        setCommentText('');
        setCommentCount(prev => prev + 1);
      } else {
        setCommentError(data.error || 'Failed to add comment');
      }
    } catch (err) {
      setCommentError('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <Card sx={{
      maxWidth: 350,
      minWidth: 350,
      width: '100%',
      maxHeight: 600,
      minHeight: 600,
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
            <Box>
              <IconButton size="small" color={liked ? 'error' : 'default'} onClick={handleLike} sx={{ p: 0.5 }}>
                {liked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
              </IconButton>
              <Typography variant="caption" color="text.secondary">{likeCount}</Typography>
              <IconButton size="small" color="primary" onClick={openCommentModal} sx={{ p: 0.5 }}>
                <ChatBubbleOutline fontSize="small" />
              </IconButton>
              <Typography variant="caption" color="text.secondary">{commentCount}</Typography>
              <IconButton size="small" color="primary" onClick={e => { e.stopPropagation(); alert('Share feature coming soon!'); }}>
                <Share fontSize="small" />
              </IconButton>
            </Box>
          </Stack>
        </Box>
      </CardContent>
      {/* Comment Modal */}
      <Dialog open={commentModalOpen} onClose={closeCommentModal} maxWidth="sm" fullWidth>
        <DialogTitle>Comments</DialogTitle>
        <DialogContent dividers sx={{ minHeight: 200, maxHeight: 400, overflowY: 'auto' }}>
          {commentLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress size={24} /></Box>
          ) : commentError ? (
            <Typography color="error">{commentError}</Typography>
          ) : comments.length === 0 ? (
            <Typography color="text.secondary">No comments yet. Be the first to comment!</Typography>
          ) : (
            <Stack spacing={2}>
              {comments.map((c, idx) => (
                <Box key={idx} sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="subtitle2" color="primary.main">{c.userName || 'User'}</Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>{c.text}</Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(c.createdAt).toLocaleString()}</Typography>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, p: 2 }}>
          <TextField
            label="Add a comment"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            disabled={commentLoading}
            error={!!commentError}
            helperText={commentError}
          />
          <Button onClick={handleAddComment} variant="contained" disabled={commentLoading || !commentText.trim()}>
            Post
          </Button>
          <Button onClick={closeCommentModal} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default CampaignCard;