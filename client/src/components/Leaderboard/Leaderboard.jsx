import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Tabs, Tab, Paper, CircularProgress, Stack, Tooltip } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_AVATAR = '/default-avatar.png'; // Place a default avatar in your public folder

function getProfilePicUrl(pic) {
  if (!pic) return DEFAULT_AVATAR;
  if (pic.startsWith('http')) return pic;
  return `${API_URL}${pic}`;
}

function Leaderboard() {
  const [tab, setTab] = useState(0);
  const [mostDonations, setMostDonations] = useState([]);
  const [mostAmount, setMostAmount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      fetch(`${API_URL}/api/campaigns/leaderboard/most-donations?top=10`).then(r => r.json()),
      fetch(`${API_URL}/api/campaigns/leaderboard/most-amount?top=10`).then(r => r.json())
    ]).then(([donations, amount]) => {
      if (!donations.success) throw new Error(donations.error || 'Failed to load most donations');
      if (!amount.success) throw new Error(amount.error || 'Failed to load most amount');
      setMostDonations(donations.leaderboard);
      setMostAmount(amount.leaderboard);
    }).catch(err => {
      setError(err.message || 'Failed to load leaderboard');
    }).finally(() => setLoading(false));
  }, []);

  const renderRow = (user, idx, type) => {
    const isTop3 = idx < 3;
    const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
    return (
      <Paper key={user.userId} elevation={isTop3 ? 6 : 1} sx={{
        display: 'flex', alignItems: 'center', p: 2, mb: 1.5, borderRadius: 2,
        bgcolor: isTop3 ? medalColors[idx] + '22' : 'background.paper',
        border: isTop3 ? `2px solid ${medalColors[idx]}` : '1px solid #eee',
        gap: 2
      }}>
        <Box sx={{ width: 32, textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
          {isTop3 ? <EmojiEventsIcon sx={{ color: medalColors[idx] }} /> : idx + 1}
        </Box>
        <Avatar src={getProfilePicUrl(user.profilePicture)} alt={user.firstName || 'User'} sx={{ width: 48, height: 48, mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={700} fontSize={18}>
            {user.firstName || 'Anonymous'} {user.lastName || ''}
          </Typography>
          {user.country && (
            <Typography variant="caption" color="text.secondary">{user.country}</Typography>
          )}
        </Box>
        <Box sx={{ minWidth: 100, textAlign: 'right' }}>
          {type === 'count' ? (
            <Tooltip title="Number of Donations"><span>{user.donationCount} donations</span></Tooltip>
          ) : (
            <Tooltip title="Total Donated"><span><MonetizationOnIcon sx={{ color: 'success.main', mr: 0.5, verticalAlign: 'middle' }} />${user.totalDonated.toLocaleString()}</span></Tooltip>
          )}
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', my: 4, p: 2 }}>
      <Typography variant="h4" fontWeight={900} textAlign="center" sx={{ mb: 2 }}>
        Leaderboard
      </Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
        <Tab label="Most Donations" />
        <Tab label="Most Donated" />
      </Tabs>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center">{error}</Typography>
      ) : (
        <Box>
          {tab === 0 && (
            <Box>
              {mostDonations.length === 0 ? (
                <Typography textAlign="center" color="text.secondary">No donors yet.</Typography>
              ) : (
                mostDonations.map((user, idx) => renderRow(user, idx, 'count'))
              )}
            </Box>
          )}
          {tab === 1 && (
            <Box>
              {mostAmount.length === 0 ? (
                <Typography textAlign="center" color="text.secondary">No donors yet.</Typography>
              ) : (
                mostAmount.map((user, idx) => renderRow(user, idx, 'amount'))
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default Leaderboard; 