import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert, Snackbar } from '@mui/material';
import CampaignCard from '../../components/Card/CampainCard/CampainCard';
import EditCampaignModal from '../../components/Card/CampainCard/EditCampaignModal';
import CampaignDetailsModal from '../../components/Card/CampainCard/CampaignDetailsModal';

function UserCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editModal, setEditModal] = useState({ open: false, campaign: null });
  const [editLoading, setEditLoading] = useState(false);
  // Details modal state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Fetch user's campaigns with withdrawal info
  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/my-withdrawals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch campaigns');
      setCampaigns(data.campaigns);
    } catch (err) {
      setError(err.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Delete campaign
  const handleDelete = async (campaign) => {
    if (!window.confirm(`Are you sure you want to delete "${campaign.title}"? This cannot be undone.`)) return;
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/${campaign._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to delete campaign');
      setSnackbar({ open: true, message: 'Campaign deleted.', severity: 'success' });
      fetchCampaigns();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to delete campaign', severity: 'error' });
    }
  };

  // Edit campaign
  const handleEdit = (campaign) => setEditModal({ open: true, campaign });
  const handleEditCancel = () => setEditModal({ open: false, campaign: null });
  const handleEditSubmit = async (form, removeSupportDoc) => {
    setEditLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const formData = new FormData();
      formData.append('type', form.type);
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('amountNeeded', form.amount);
      // Photos: send all (existing URLs as 'existingPhotos', new files as 'photos')
      const existingPhotos = form.photos.filter(p => typeof p === 'string');
      existingPhotos.forEach(url => formData.append('existingPhotos', url));
      form.photos.filter(p => typeof p !== 'string').forEach(file => formData.append('photos', file));
      // Support Document
      if (form.supportDoc && typeof form.supportDoc !== 'string') {
        formData.append('supportDoc', form.supportDoc);
      }
      if (removeSupportDoc) {
        formData.append('removeSupportDoc', 'true');
      }
      // Links
      form.links.filter(link => link && link.trim()).forEach(link => formData.append('links', link));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/${editModal.campaign._id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to update campaign');
      setSnackbar({ open: true, message: 'Campaign updated.', severity: 'success' });
      setEditModal({ open: false, campaign: null });
      fetchCampaigns();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to update campaign', severity: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  // Details modal handlers
  const handleViewDetails = (campaign) => {
    setSelectedCampaign(campaign);
    setDetailsOpen(true);
  };
  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedCampaign(null);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h4" fontWeight={900} sx={{ mb: 3 }}>
        My Campaigns
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : campaigns.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          You haven't created any campaigns yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {campaigns.map((campaign) => (
            <Grid item xs={12} sm={6} md={4} key={campaign._id}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Total Collected: <b>${campaign.amountReceived?.toLocaleString() || 0}</b></Typography>
                <Typography variant="subtitle2" color="text.secondary">Total Withdrawn: <b>${campaign.totalWithdrawn?.toLocaleString() || 0}</b></Typography>
                <Typography variant="subtitle2" color="text.secondary">Withdrawable: <b>${campaign.withdrawableAmount?.toLocaleString() || 0}</b></Typography>
              </Box>
              <CampaignCard
                campaign={campaign}
                mode="mine"
                onEdit={() => handleEdit(campaign)}
                onDelete={() => handleDelete(campaign)}
                onViewDetails={() => handleViewDetails(campaign)}
              />
              
            </Grid>
          ))}
        </Grid>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <EditCampaignModal
        open={editModal.open}
        campaign={editModal.campaign}
        onClose={handleEditCancel}
        onSubmit={handleEditSubmit}
        loading={editLoading}
      />
      <CampaignDetailsModal
        open={detailsOpen}
        campaign={selectedCampaign}
        onClose={handleCloseDetails}
      />
    </Box>
  );
}

export default UserCampaigns;