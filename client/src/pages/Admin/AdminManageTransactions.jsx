import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, TextField, InputAdornment, Fade, CircularProgress, Alert, Stack
} from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import { Search } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

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
  borderRadius: '32px',
  border: '1.5px solid rgba(255,255,255,0.13)',
  overflow: 'hidden',
  position: 'relative',
  transform: 'translateZ(0)',
  transition: 'box-shadow 0.3s'
});

function AdminManageTransactions() {
  const theme = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('jwt');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setTransactions(data.transactions);
        } else {
          setError(data.error || 'Failed to load transactions');
        }
      } catch (err) {
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Filter transactions by user/campaign name/email/title
  const filteredTransactions = transactions.filter(tx => {
    const user = tx.userId || {};
    const campaign = tx.campaignId || {};
    const searchLower = search.toLowerCase();
    return (
      (user.firstName && user.firstName.toLowerCase().includes(searchLower)) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (campaign.title && campaign.title.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        px: { xs: 1, md: 4 },
        pt: { xs: 6, md: 10 },
        pb: { xs: 4, md: 8 },
        display: 'block',
      }}
    >
      <Fade in timeout={900}>
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1200, mx: 'auto' }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
            <PaidIcon color="success" fontSize="large" />
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{ letterSpacing: '-1.2px', background: theme.palette.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Transactions Management
            </Typography>
          </Stack>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by user or campaign"
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ width: 300, ...glass3DGlowStyle(theme) }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ ...glass3DGlowStyle(theme), px: 0, py: 0 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Campaign</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography color="text.secondary">No transactions found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <TableRow key={tx._id} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar sx={{ width: 28, height: 28 }}>
                              {tx.userId && tx.userId.firstName ? tx.userId.firstName[0] : '?'}
                            </Avatar>
                            <span>{tx.userId ? `${tx.userId.firstName || ''} ${tx.userId.lastName || ''}` : 'Unknown'}</span>
                            <Typography variant="caption" color="text.secondary">{tx.userId ? tx.userId.email : ''}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{tx.campaignId ? tx.campaignId.title : 'Unknown'}</TableCell>
                        <TableCell>${tx.amount}</TableCell>
                        <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Fade>
    </Box>
  );
}

export default AdminManageTransactions;