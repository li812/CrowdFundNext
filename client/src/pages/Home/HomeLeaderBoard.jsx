import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, CircularProgress, Tabs, Tab, Tooltip, useMediaQuery, useTheme, Stack } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_AVATAR = '/default-avatar.png';

function getProfilePicUrl(pic) {
  if (!pic) return DEFAULT_AVATAR;
  if (pic.startsWith('http')) return pic;
  return `${API_URL}${pic}`;
}

function LeaderboardBlock({ title, icon, endpoint, statKey, statLabel, statIcon }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${API_URL}${endpoint}?top=10`)
      .then(r => r.json())
      .then(res => {
        if (!res.success) throw new Error(res.error || 'Failed to load leaderboard');
        setData(res.leaderboard);
      })
      .catch(err => setError(err.message || 'Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, [endpoint]);

  return (
    <Paper elevation={4} sx={{ p: 3, borderRadius: 4, minWidth: 320, flex: 1, mx: 1, mb: { xs: 3, md: 0 } }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        {icon}
        <Typography variant="h5" fontWeight={800}>{title}</Typography>
      </Stack>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress /></Box>
      ) : error ? (
        <Typography color="error" textAlign="center">{error}</Typography>
      ) : data.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">No donors yet.</Typography>
      ) : (
        data.map((user, idx) => {
          const isTop3 = idx < 3;
          const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
          return (
            <Paper key={user.userId} elevation={isTop3 ? 6 : 1} sx={{
              display: 'flex', alignItems: 'center', p: 1.5, mb: 1.2, borderRadius: 2,
              bgcolor: isTop3 ? medalColors[idx] + '22' : 'background.paper',
              border: isTop3 ? `2px solid ${medalColors[idx]}` : '1px solid #eee',
              gap: 2
            }}>
              <Box sx={{ width: 32, textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
                {isTop3 ? <EmojiEventsIcon sx={{ color: medalColors[idx] }} /> : idx + 1}
              </Box>
              <Avatar src={getProfilePicUrl(user.profilePicture)} alt={user.firstName || 'User'} sx={{ width: 44, height: 44, mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={700} fontSize={17}>
                  {user.firstName || 'Anonymous'} {user.lastName || ''}
                </Typography>
                {user.country && (
                  <Typography variant="caption" color="text.secondary">{user.country}</Typography>
                )}
              </Box>
              <Box sx={{ minWidth: 90, textAlign: 'right' }}>
                <Tooltip title={statLabel}>
                  <span>
                    {statIcon}
                    {statKey === 'totalDonated'
                      ? `$${user[statKey]?.toLocaleString()}`
                      : `${user[statKey]} donations`}
                  </span>
                </Tooltip>
              </Box>
            </Paper>
          );
        })
      )}
    </Paper>
  );
}

function HomeLeaderBoard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', my: 6, p: 2 }}>
      {/* Hero/Banner Section */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <EmojiEventsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
        <Typography variant="h3" fontWeight={900} sx={{ mb: 1 }}>
          Leaderboard
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Celebrating our top supporters! See who's making the biggest impact on CrowdFundNext.
        </Typography>
      </Box>
      {/* Leaderboards Side by Side on Desktop, Stacked on Mobile */}
      <Stack direction={isMobile ? 'column' : 'row'} spacing={3} alignItems="flex-start" justifyContent="center">
        <LeaderboardBlock
          title="Most Donations"
          icon={<EmojiEventsIcon color="warning" />}
          endpoint="/api/campaigns/leaderboard/most-donations"
          statKey="donationCount"
          statLabel="Number of Donations"
          statIcon={<EmojiEventsIcon sx={{ color: 'warning.main', mr: 0.5, verticalAlign: 'middle' }} />}
        />
        <LeaderboardBlock
          title="Most Donated"
          icon={<MonetizationOnIcon color="success" />}
          endpoint="/api/campaigns/leaderboard/most-amount"
          statKey="totalDonated"
          statLabel="Total Donated"
          statIcon={<MonetizationOnIcon sx={{ color: 'success.main', mr: 0.5, verticalAlign: 'middle' }} />}
        />
      </Stack>
    </Box>
  );
}

export default HomeLeaderBoard; 