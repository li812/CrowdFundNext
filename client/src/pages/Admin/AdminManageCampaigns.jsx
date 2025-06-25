import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, IconButton, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Button, Fade, Chip, MenuItem, Select, FormControl, InputLabel, LinearProgress, Tooltip, Stack, CircularProgress, Alert, Grid, ImageList, ImageListItem
} from '@mui/material';
import { Delete, Search, Visibility, CheckCircle, Cancel, DoneAll, Link as LinkIcon, PictureAsPdf } from '@mui/icons-material';
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

const CAMPAIGN_TYPES = [
  'Tech', 'Education', 'Health', 'Art', 'Social Good', 'Environment', 'Startups', 'Student Life', 'Others'
];
const STATUS_OPTIONS = ['all', 'pending', 'approved', 'active', 'finished', 'rejected'];

const statusColors = {
  pending: 'warning',
  approved: 'success',
  active: 'info',
  finished: 'secondary',
  rejected: 'error',
};

function AdminManageCampaigns() {
  const theme = useTheme();
  const [campaigns, setCampaigns] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [detailsDialog, setDetailsDialog] = useState({ open: false, campaign: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, campaign: null });
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch campaigns from backend
  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('jwt');
      const params = new URLSearchParams({
        status: statusFilter,
        type: typeFilter,
        country: countryFilter,
        search,
        page,
        limit
      });
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/campaigns?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch campaigns');
      setCampaigns(data.campaigns);
      setTotal(data.total);
    } catch (err) {
      setError(err.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line
  }, [statusFilter, typeFilter, countryFilter, search, page]);

  // Unique countries for filter
  const countryOptions = ['all', ...Array.from(new Set(campaigns.map(c => c.country).filter(Boolean)))];

  // Actions
  const handleApprove = async (campaign) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/campaigns/${campaign._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'approved' })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to approve campaign');
      fetchCampaigns();
    } catch (err) {
      setError(err.message || 'Failed to approve campaign');
    } finally {
      setActionLoading(false);
    }
  };
  const handleReject = async (campaign) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/campaigns/${campaign._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'rejected' })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to reject campaign');
      fetchCampaigns();
    } catch (err) {
      setError(err.message || 'Failed to reject campaign');
    } finally {
      setActionLoading(false);
    }
  };
  const handleDelete = (campaign) => {
    setDeleteDialog({ open: true, campaign });
  };
  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/campaigns/${deleteDialog.campaign._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to delete campaign');
      setDeleteDialog({ open: false, campaign: null });
      fetchCampaigns();
    } catch (err) {
      setError(err.message || 'Failed to delete campaign');
    } finally {
      setActionLoading(false);
    }
  };
  const cancelDelete = () => setDeleteDialog({ open: false, campaign: null });
  const handleView = (campaign) => setDetailsDialog({ open: true, campaign });
  const closeDetails = () => setDetailsDialog({ open: false, campaign: null });

  const getFileUrl = (file) => file ? `${import.meta.env.VITE_API_URL || ''}${file}` : undefined;

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
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1300, mx: 'auto' }}>
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{ mb: 4, letterSpacing: '-1.2px', textAlign: 'left', background: theme.palette.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Campaigns Management
          </Typography>
          {/* Filters Bar */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                {STATUS_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select value={typeFilter} label="Type" onChange={e => { setTypeFilter(e.target.value); setPage(1); }}>
                <MenuItem value="all">All</MenuItem>
                {CAMPAIGN_TYPES.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Country</InputLabel>
              <Select value={countryFilter} label="Country" onChange={e => { setCountryFilter(e.target.value); setPage(1); }}>
                {countryOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by title or creator"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              sx={{ width: 260, ...glass3DGlowStyle(theme) }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
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
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Creator</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Raised / Target</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {campaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography color="text.secondary">No campaigns found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    campaigns.map((c) => (
                      <TableRow key={c._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography fontWeight={700}>{c.title}</Typography>
                            <Chip label={c.type} size="small" color="primary" sx={{ ml: 1, fontWeight: 700 }} />
                          </Box>
                        </TableCell>
                        <TableCell>{c.type}</TableCell>
                        <TableCell>
                          <Tooltip title={c.creator?.email || ''}>
                            <span>{c.creator?.firstName ? `${c.creator.firstName} ${c.creator.lastName}` : c.creator?.email || 'Unknown'}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Chip label={c.status.charAt(0).toUpperCase() + c.status.slice(1)} size="small" color={statusColors[c.status]} sx={{ fontWeight: 700 }} />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ minWidth: 120 }}>
                            <Typography fontWeight={700} sx={{ fontSize: '1.1rem' }}>
                              ${c.amountReceived?.toLocaleString() || 0} / ${c.amountNeeded?.toLocaleString() || 0}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(100, ((c.amountReceived || 0) / (c.amountNeeded || 1)) * 100)}
                              sx={{ height: 8, borderRadius: 5, mt: 0.5, background: theme.palette.mode === 'dark' ? '#232946' : '#e0e0e0' }}
                              color={c.amountReceived >= c.amountNeeded ? 'success' : 'primary'}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>{c.country || c.creator?.country || ''}</TableCell>
                        <TableCell>{c.state || c.creator?.state || ''}</TableCell>
                        <TableCell>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}</TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="View Details"><span><IconButton onClick={() => handleView(c)}><Visibility /></IconButton></span></Tooltip>
                            {c.status === 'pending' && (
                              <>
                                <Tooltip title="Approve"><span><IconButton color="success" disabled={actionLoading} onClick={() => handleApprove(c)}><CheckCircle /></IconButton></span></Tooltip>
                                <Tooltip title="Reject"><span><IconButton color="error" disabled={actionLoading} onClick={() => handleReject(c)}><Cancel /></IconButton></span></Tooltip>
                              </>
                            )}
                            <Tooltip title="Delete"><span><IconButton color="error" disabled={actionLoading} onClick={() => handleDelete(c)}><Delete /></IconButton></span></Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {/* Pagination (simple) */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center" sx={{ mt: 2 }}>
            <Button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
            <Typography>Page {page}</Typography>
            <Button disabled={page * limit >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
          </Stack>
        </Box>
      </Fade>
      {/* Details Dialog */}
      <Dialog open={detailsDialog.open} onClose={closeDetails} maxWidth="md" fullWidth>
        <DialogTitle>Campaign Details</DialogTitle>
        <DialogContent dividers sx={{ bgcolor: theme.palette.background.glass, borderRadius: 3 }}>
          {detailsDialog.campaign && (
            <Box sx={{ p: 1 }}>
              <Typography variant="h5" fontWeight={900} sx={{ mb: 1, letterSpacing: '-1.2px' }}>
                {detailsDialog.campaign.title}
                <Chip label={detailsDialog.campaign.type} size="small" color="primary" sx={{ ml: 2, fontWeight: 700 }} />
                <Chip label={detailsDialog.campaign.status} size="small" color={statusColors[detailsDialog.campaign.status]} sx={{ ml: 1, fontWeight: 700 }} />
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <b>Creator:</b> {detailsDialog.campaign.creator?.firstName ? `${detailsDialog.campaign.creator.firstName} ${detailsDialog.campaign.creator.lastName}` : detailsDialog.campaign.creator?.email || 'Unknown'}
                {detailsDialog.campaign.creator?.email && (
                  <span style={{ color: theme.palette.text.secondary, marginLeft: 8 }}>({detailsDialog.campaign.creator.email})</span>
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                <b>Description:</b> {detailsDialog.campaign.description || 'No description provided.'}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography fontWeight={700} sx={{ fontSize: '1.1rem' }}>
                  <b>Amount Raised:</b> ${detailsDialog.campaign.amountReceived?.toLocaleString() || 0} / ${detailsDialog.campaign.amountNeeded?.toLocaleString() || 0}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, ((detailsDialog.campaign.amountReceived || 0) / (detailsDialog.campaign.amountNeeded || 1)) * 100)}
                  sx={{ height: 10, borderRadius: 5, mt: 0.5, background: theme.palette.mode === 'dark' ? '#232946' : '#e0e0e0' }}
                  color={detailsDialog.campaign.amountReceived >= detailsDialog.campaign.amountNeeded ? 'success' : 'primary'}
                />
              </Box>
              <Grid container spacing={3}>
                {/* Photos Gallery */}
                {detailsDialog.campaign.photos && detailsDialog.campaign.photos.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <Typography fontWeight={700} sx={{ mb: 1 }}><PictureAsPdf sx={{ mr: 1, verticalAlign: 'middle' }} />Photos</Typography>
                    <ImageList cols={2} gap={8} sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                      {detailsDialog.campaign.photos.map((photo, idx) => (
                        <ImageListItem key={idx}>
                          <img
                            src={getFileUrl(photo)}
                            alt={`Campaign Photo ${idx + 1}`}
                            style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
                            loading="lazy"
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Grid>
                )}
                {/* Support Docs */}
                {detailsDialog.campaign.supportDocument && (
                  <Grid item xs={12} md={6}>
                    <Typography fontWeight={700} sx={{ mb: 1 }}><PictureAsPdf sx={{ mr: 1, verticalAlign: 'middle' }} />Support Document</Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<PictureAsPdf />}
                      href={getFileUrl(detailsDialog.campaign.supportDocument)}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mb: 2 }}
                    >
                      View PDF
                    </Button>
                  </Grid>
                )}
              </Grid>
              {/* Links */}
              {detailsDialog.campaign.links && detailsDialog.campaign.links.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography fontWeight={700} sx={{ mb: 1 }}><LinkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Links</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {detailsDialog.campaign.links.map((link, idx) => (
                      <Button
                        key={idx}
                        variant="outlined"
                        color="info"
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ mb: 1 }}
                        startIcon={<LinkIcon />}
                      >
                        {link.length > 32 ? link.slice(0, 32) + '...' : link}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              )}
              {/* Metadata */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={3}><Typography variant="body2"><b>Country:</b> {detailsDialog.campaign.country || detailsDialog.campaign.creator?.country || ''}</Typography></Grid>
                <Grid item xs={12} sm={6} md={3}><Typography variant="body2"><b>State:</b> {detailsDialog.campaign.state || detailsDialog.campaign.creator?.state || ''}</Typography></Grid>
                <Grid item xs={12} sm={6} md={3}><Typography variant="body2"><b>Created At:</b> {detailsDialog.campaign.createdAt ? new Date(detailsDialog.campaign.createdAt).toLocaleDateString() : ''}</Typography></Grid>
                <Grid item xs={12} sm={6} md={3}><Typography variant="body2"><b>Last Updated:</b> {detailsDialog.campaign.updatedAt ? new Date(detailsDialog.campaign.updatedAt).toLocaleDateString() : ''}</Typography></Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetails}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialog.open} onClose={cancelDelete}>
        <DialogTitle>Delete Campaign</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <b>{deleteDialog.campaign?.title}</b>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={actionLoading}>{actionLoading ? <CircularProgress size={20} /> : 'Delete'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminManageCampaigns;
