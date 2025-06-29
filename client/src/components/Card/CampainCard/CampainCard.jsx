import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, CardMedia, Typography, Box, Button, Chip, Stack, LinearProgress, IconButton, Tooltip, Link as MuiLink, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress
} from '@mui/material';
import { Edit, Delete, AttachMoney, Info, ArrowBackIos, ArrowForwardIos, PictureAsPdf, Link as LinkIcon, Lock, Share, FavoriteBorder, Favorite, ChatBubbleOutline, AccessTime, Timer } from '@mui/icons-material';
import DonationAmountModal from './DonationAmountModal';

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

  // Local state for campaign data to handle real-time updates
  const [localCampaign, setLocalCampaign] = useState(campaign);

  // Update local campaign when prop changes
  useEffect(() => {
    setLocalCampaign(campaign);
  }, [campaign]);

  // Progress calculation using local state
  const progress = Math.min(
    100,
    Math.round((localCampaign.amountReceived / localCampaign.amountNeeded) * 100)
  );

  // Time period calculations
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timeProgress, setTimeProgress] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    console.log('Campaign time data:', {
      hasTimeLimit: localCampaign.hasTimeLimit,
      endDate: localCampaign.endDate,
      createdAt: localCampaign.createdAt,
      timeLimitType: localCampaign.timeLimitType
    });

    if (localCampaign.hasTimeLimit && localCampaign.endDate) {
      const updateTime = () => {
        const now = new Date();
        const end = new Date(localCampaign.endDate);
        const diff = end - now;
        
        if (diff <= 0) {
          setTimeRemaining(0);
          setIsExpired(true);
        } else {
          setTimeRemaining(Math.ceil(diff / (1000 * 60 * 60 * 24)));
          setIsExpired(false);
        }

        // Calculate time progress
        const start = new Date(localCampaign.createdAt);
        const total = end - start;
        const elapsed = now - start;
        setTimeProgress(Math.min(100, Math.max(0, (elapsed / total) * 100)));
      };

      updateTime();
      const interval = setInterval(updateTime, 60000); // Update every minute
      return () => clearInterval(interval);
    } else {
      // For campaigns without explicit time limits, show days since creation
      const now = new Date();
      const created = new Date(localCampaign.createdAt);
      const daysSinceCreation = Math.ceil((now - created) / (1000 * 60 * 60 * 24));
      setTimeRemaining(daysSinceCreation);
      setTimeProgress(null);
      setIsExpired(false);
    }
  }, [localCampaign.hasTimeLimit, localCampaign.endDate, localCampaign.createdAt, localCampaign.timeLimitType]);

  // Status color
  const statusColor =
    localCampaign.status === 'approved' ? 'success' :
      localCampaign.status === 'pending' ? 'warning' :
        localCampaign.status === 'rejected' ? 'error' :
          localCampaign.status === 'expired' ? 'error' :
            localCampaign.status === 'completed' ? 'success' : 'default';

  // Check if current user is the creator of this campaign
  const currentUserId = localStorage.getItem('userId');
  const isOwnCampaign = currentUserId && localCampaign.createdBy === currentUserId;

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
  const [amountModalOpen, setAmountModalOpen] = useState(false);

  // Check if current user liked this campaign
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (localCampaign.likes && userId) {
      setLiked(localCampaign.likes.includes(userId));
    }
    setLikeCount(localCampaign.likes ? localCampaign.likes.length : 0);
    setCommentCount(localCampaign.comments ? localCampaign.comments.length : 0);
  }, [localCampaign.likes, localCampaign.comments]);

  // Like/unlike handler
  const handleLike = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('jwt');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/${localCampaign._id}/like`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/${localCampaign._id}/comments`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/${localCampaign._id}/comments`, {
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

  const handleDonateClick = () => {
    setAmountModalOpen(true);
  };
  const handleAmountSuccess = async (amount) => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/donate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ campaignId: localCampaign._id, amount })
      });
      const data = await res.json();
      if (data.success) {
        // Update local campaign state immediately
        if (data.campaign) {
          setLocalCampaign(prev => ({ ...prev, amountReceived: data.campaign.amountReceived }));
        }
        
        // Call onDonate callback if provided to refresh parent data
        if (onDonate) {
          onDonate(data.campaign || { ...localCampaign, amountReceived: localCampaign.amountReceived + amount });
        }
        
        alert(`Thank you for donating $${amount}!`);
      } else {
        alert(data.error || 'Failed to record donation.');
      }
    } catch (err) {
      alert('Failed to record donation.');
    }
  };

  // Format time remaining
  const formatTimeRemaining = (days) => {
    if (days === 0) return 'Ended';
    if (days === 1) return '1 day left';
    if (days < 7) return `${days} days left`;
    if (days < 30) return `${Math.ceil(days / 7)} weeks left`;
    return `${Math.ceil(days / 30)} months left`;
  };

  // Get urgency color
  const getUrgencyColor = (days) => {
    if (days === 0) return 'error';
    if (days <= 3) return 'error';
    if (days <= 7) return 'warning';
    if (days <= 30) return 'info';
    return 'success';
  };

  // Get time display color based on campaign type
  const getTimeDisplayColor = (days, hasTimeLimit) => {
    if (!hasTimeLimit) return 'text.secondary'; // For campaigns without time limits
    return getUrgencyColor(days);
  };

  return (
    <Card sx={{
      maxWidth: 350,
      minWidth: 350,
      width: '100%',
      maxHeight: 635,
      minHeight: 635,
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
          alt={localCampaign.title}
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
            <Chip label={localCampaign.type} color="primary" size="small" />
            {mode === 'mine' && (
              <Chip label={localCampaign.status} color={statusColor} size="small" />
            )}
          </Stack>
          <Typography variant="h6" fontWeight={700} gutterBottom noWrap>{localCampaign.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} >
            {localCampaign.description}
          </Typography>
          
          {/* Time Period Display */}
          {timeRemaining !== null && (
            <Box sx={{ mb: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                <AccessTime fontSize="small" color={getTimeDisplayColor(timeRemaining, localCampaign.hasTimeLimit)} />
                <Typography 
                  variant="caption" 
                  color={getTimeDisplayColor(timeRemaining, localCampaign.hasTimeLimit)}
                  fontWeight={600}
                >
                  {localCampaign.hasTimeLimit && localCampaign.endDate 
                    ? formatTimeRemaining(timeRemaining)
                    : `${timeRemaining} days ago`
                  }
                </Typography>
              </Stack>
              {timeProgress !== null && localCampaign.hasTimeLimit && localCampaign.endDate && (
                <LinearProgress
                  variant="determinate"
                  value={timeProgress}
                  color={getTimeDisplayColor(timeRemaining, localCampaign.hasTimeLimit)}
                  sx={{ height: 4, borderRadius: 2 }}
                />
              )}
            </Box>
          )}
          
          <Box sx={{ mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={progress === 100 ? 'success' : 'primary'}
              sx={{ height: 17, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary">
              ${localCampaign.amountReceived} raised of ${localCampaign.amountNeeded} goal ({progress}%)
            </Typography>
          </Box>

          {mode === 'mine' && localCampaign.status === 'rejected' && localCampaign.adminComment && (
            <Typography variant="caption" color="error" sx={{ mb: 1, display: 'block' }}>
              Admin: {localCampaign.adminComment}
            </Typography>
          )}
        </Box>
        <Box sx={{ mt: 1 }}>
          <Stack direction="row" spacing={1}>
            {mode === 'mine' && localCampaign.status !== 'approved' && (
              <>
                <Tooltip title="Edit">
                  <IconButton color="primary" onClick={onEdit}><Edit /></IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={onDelete}><Delete /></IconButton>
                </Tooltip>
              </>
            )}
            {mode === 'other' && localCampaign.status === 'approved' && !isOwnCampaign && !isExpired && (
              <Button
                variant="contained"
                color="success"
                startIcon={<AttachMoney />}
                onClick={handleDonateClick}
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
            {/* Only show like/comment/share buttons if not the user's own campaign */}
            {mode === 'other' && !isOwnCampaign && (
              <>
                <Tooltip title={liked ? 'Unlike' : 'Like'}>
                  <IconButton
                    size="small"
                    onClick={handleLike}
                    color={liked ? 'primary' : 'default'}
                  >
                    {liked ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Comments">
                  <IconButton size="small" onClick={openCommentModal}>
                    <ChatBubbleOutline />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: localCampaign.title,
                          text: localCampaign.description,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                  >
                    <Share />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
          {/* Like and comment counts */}
          {mode === 'other' && !isOwnCampaign && (
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {likeCount} {likeCount === 1 ? 'like' : 'likes'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
              </Typography>
            </Stack>
          )}
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
                <Box key={idx} sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 1, boxShadow: 1 }}>
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
      <DonationAmountModal
        open={amountModalOpen}
        onClose={() => setAmountModalOpen(false)}
        maxAmount={localCampaign.amountNeeded - localCampaign.amountReceived}
        campaign={localCampaign}
        onSuccess={handleAmountSuccess}
      />
    </Card>
  );
}

export default CampaignCard;