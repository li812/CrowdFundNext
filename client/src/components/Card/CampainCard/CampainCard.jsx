import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, CardMedia, Typography, Box, Button, Chip, Stack, LinearProgress, IconButton, Tooltip, Link as MuiLink, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Snackbar
} from '@mui/material';
import { Edit, Delete, AttachMoney, Info, ArrowBackIos, ArrowForwardIos, PictureAsPdf, Link as LinkIcon, Lock, Share, FavoriteBorder, Favorite, ChatBubbleOutline, AccessTime, Timer, CheckCircle, Cancel, EmojiEvents, Warning, AccountBalanceWallet } from '@mui/icons-material';
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

  // Enhanced status handling
  const getStatusInfo = () => {
    switch (localCampaign.status) {
      case 'pending':
        return { color: 'warning', label: 'Pending', icon: <Timer />, description: 'Awaiting approval' };
      case 'approved':
        return { color: 'success', label: 'Active', icon: <Info />, description: 'Campaign is live' };
      case 'rejected':
        return { color: 'error', label: 'Rejected', icon: <Cancel />, description: 'Not approved' };
      case 'funded':
        return { color: 'success', label: 'Funded!', icon: <EmojiEvents />, description: 'Goal reached!' };
      case 'completed':
        return { color: 'success', label: 'Completed', icon: <CheckCircle />, description: 'Successfully completed' };
      case 'failed':
        return { color: 'error', label: 'Failed', icon: <Cancel />, description: 'Did not reach goal' };
      case 'expired':
        return { color: 'error', label: 'Expired', icon: <Warning />, description: 'Time limit reached' };
      default:
        return { color: 'default', label: localCampaign.status, icon: <Info />, description: '' };
    }
  };

  const statusInfo = getStatusInfo();

  // Check if current user is the creator of this campaign
  const currentUserId = localStorage.getItem('userId');
  const isOwnCampaign = currentUserId && localCampaign.createdBy === currentUserId;

  // Check if campaign is in a final state (no more donations)
  const isFinalState = ['completed', 'failed', 'expired', 'rejected', 'funded'].includes(localCampaign.status);
  const canDonate = localCampaign.status === 'approved' && !isExpired && !isOwnCampaign;

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
        body: JSON.stringify({
          campaignId: localCampaign._id,
          amount: amount
        })
      });
      const data = await res.json();
      if (data.success) {
        setLocalCampaign(data.campaign);
        setAmountModalOpen(false);
        if (onDonate) {
          onDonate(data.campaign);
        }
      }
    } catch (error) {
      console.error('Donation error:', error);
    }
  };

  const formatTimeRemaining = (days) => {
    if (days === 0) return 'Ended today';
    if (days === 1) return 'Ends tomorrow';
    if (days < 7) return `${days} days left`;
    if (days < 30) return `${Math.ceil(days / 7)} weeks left`;
    return `${Math.ceil(days / 30)} months left`;
  };

  const getUrgencyColor = (days) => {
    if (days <= 3) return 'error';
    if (days <= 7) return 'warning';
    return 'success';
  };

  const getTimeDisplayColor = (days, hasTimeLimit) => {
    if (!hasTimeLimit) return 'text.secondary';
    return getUrgencyColor(days);
  };

  // Add Withdraw button handler
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({ accountNumber: '', ifsc: '', name: '' });
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleWithdrawClick = () => {
    setWithdrawModalOpen(true);
    setWithdrawAmount(campaign.withdrawableAmount || '');
    setBankDetails({ accountNumber: '', ifsc: '', name: '' });
    setWithdrawError('');
  };
  const handleWithdrawClose = () => {
    setWithdrawModalOpen(false);
    setWithdrawError('');
  };
  const handleWithdrawSubmit = async () => {
    setWithdrawLoading(true);
    setWithdrawError('');
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/${campaign._id}/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          amount: Number(withdrawAmount),
          accountNumber: bankDetails.accountNumber,
          ifsc: bankDetails.ifsc,
          name: bankDetails.name
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Withdrawal failed');
      setSnackbar({ open: true, message: 'Withdrawal successful!', severity: 'success' });
      setWithdrawModalOpen(false);
      setLocalCampaign(data.campaign);
    } catch (err) {
      setWithdrawError(err.message || 'Withdrawal failed');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const remainingAmount = Math.max(0, localCampaign.amountNeeded - localCampaign.amountReceived);

  return (
    <Card sx={{
      maxWidth: 350,
      minWidth: 350,
      width: '100%',
      maxHeight: 695,
      minHeight: 635,
      display: 'flex',
      flexDirection: 'column',
      m: 2,
      position: 'relative',
      borderRadius: 2,
      boxShadow: 3,
      overflow: 'hidden',
      // Add visual indication for different states
      border: localCampaign.status === 'funded' ? '2px solid #4caf50' : 
              localCampaign.status === 'completed' ? '2px solid #2196f3' :
              localCampaign.status === 'failed' ? '2px solid #f44336' : 'none'
    }}>
      {/* Status overlay for funded/completed campaigns */}
      {(localCampaign.status === 'funded' || localCampaign.status === 'completed') && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bgcolor: localCampaign.status === 'funded' ? 'success.main' : 'primary.main',
          color: 'white',
          py: 0.5,
          px: 1,
          textAlign: 'center',
          zIndex: 2,
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          {localCampaign.status === 'funded' ? '🎉 FUNDED!' : '✅ COMPLETED!'}
        </Box>
      )}

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
            <Chip 
              label={statusInfo.label} 
              color={statusInfo.color} 
              size="small"
              icon={statusInfo.icon}
              sx={{ fontWeight: 'bold' }}
            />
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
            {/* Show overfunding message */}
            {progress > 100 && (
              <Typography variant="caption" color="success.main" sx={{ display: 'block', fontWeight: 'bold' }}>
                🎉 Overfunded by ${localCampaign.amountReceived - localCampaign.amountNeeded}!
              </Typography>
            )}
          </Box>

          {/* Status-specific messages */}
          {localCampaign.status === 'funded' && (
            <Typography variant="caption" color="success.main" sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>
              🎉 Funding goal reached! Campaign will be completed.
            </Typography>
          )}
          {localCampaign.status === 'completed' && (
            <Typography variant="caption" color="primary.main" sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>
              ✅ Campaign completed successfully!
            </Typography>
          )}
          {localCampaign.status === 'failed' && (
            <Typography variant="caption" color="error.main" sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>
              ❌ Campaign did not reach its funding goal.
            </Typography>
          )}

          {mode === 'mine' && localCampaign.status === 'rejected' && localCampaign.adminComment && (
            <Typography variant="caption" color="error" sx={{ mb: 1, display: 'block' }}>
              Admin: {localCampaign.adminComment}
            </Typography>
          )}
        </Box>
        <Box sx={{ mt: 1 }}>
          <Stack direction="row" spacing={1}>
            {/* Only show Edit/Delete if not in a final state */}
            {mode === 'mine' && !['completed','funded','failed','expired','rejected','approved'].includes(localCampaign.status) && (
              <>
                <Tooltip title="Edit">
                  <IconButton color="primary" onClick={onEdit}><Edit /></IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={onDelete}><Delete /></IconButton>
                </Tooltip>
              </>
            )}
            {/* Withdraw button for campaign creator, only if withdrawableAmount > 0 */}
            {mode === 'mine' && campaign.withdrawableAmount > 0 && (
              <Button
                variant="contained"
                color="info"
                startIcon={<AccountBalanceWallet />}
                size="small"
                onClick={handleWithdrawClick}
              >
                Withdraw
              </Button>
            )}
            {mode === 'other' && !isOwnCampaign && canDonate && remainingAmount > 0 && (
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
            {isFinalState && (
              <Button
                variant="outlined"
                color={localCampaign.status === 'completed' ? 'success' : 'error'}
                startIcon={localCampaign.status === 'completed' ? <CheckCircle /> : <Cancel />}
                size="small"
                disabled
              >
                {localCampaign.status === 'completed' ? 'Completed' : 'Ended'}
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

      {/* Donation Modal */}
      <DonationAmountModal
        open={amountModalOpen}
        onClose={() => setAmountModalOpen(false)}
        onSuccess={handleAmountSuccess}
        campaign={localCampaign}
        maxAmount={remainingAmount}
      />

      {/* Comment Modal */}
      <Dialog open={commentModalOpen} onClose={closeCommentModal} maxWidth="sm" fullWidth>
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          {commentLoading ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {comments.map((comment, idx) => (
                <Box key={idx} sx={{ mb: 2, p: 1, borderRadius: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {comment.userName}
                  </Typography>
                  <Typography variant="body2">{comment.text}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
              {comments.length === 0 && (
                <Typography color="text.secondary" textAlign="center" py={2}>
                  No comments yet. Be the first to comment!
                </Typography>
              )}
            </Box>
          )}
          {commentError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {commentError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <TextField
            fullWidth
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={commentLoading}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          />
          <Button onClick={handleAddComment} disabled={!commentText.trim() || commentLoading}>
            Post
          </Button>
          <Button onClick={closeCommentModal}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Withdraw Modal */}
      <Dialog open={withdrawModalOpen} onClose={handleWithdrawClose} maxWidth="xs" fullWidth>
        <DialogTitle>Withdraw Funds</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Withdrawable Amount: <b>${campaign.withdrawableAmount}</b></Typography>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={withdrawAmount}
            onChange={e => setWithdrawAmount(e.target.value)}
            inputProps={{ min: 1, max: campaign.withdrawableAmount }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Account Number"
            fullWidth
            value={bankDetails.accountNumber}
            onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="IFSC Code"
            fullWidth
            value={bankDetails.ifsc}
            onChange={e => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Account Holder Name"
            fullWidth
            value={bankDetails.name}
            onChange={e => setBankDetails({ ...bankDetails, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          {withdrawError && <Typography color="error" variant="body2">{withdrawError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleWithdrawClose} disabled={withdrawLoading}>Cancel</Button>
          <Button
            onClick={handleWithdrawSubmit}
            variant="contained"
            color="info"
            disabled={withdrawLoading || !withdrawAmount || withdrawAmount < 1 || withdrawAmount > campaign.withdrawableAmount || !bankDetails.accountNumber || !bankDetails.ifsc || !bankDetails.name}
          >
            {withdrawLoading ? <CircularProgress size={20} /> : 'Withdraw'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Card>
  );
}

export default CampaignCard;