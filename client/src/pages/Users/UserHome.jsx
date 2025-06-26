import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert, Divider, MenuItem, Select, FormControl, InputLabel, Stack } from '@mui/material';
import CampaignCard from '../../components/Card/CampainCard/CampainCard';
import CampaignDetailsModal from '../../components/Card/CampainCard/CampaignDetailsModal';
// Optionally import country-state-city for real data
// import { Country, State } from 'country-state-city';

const CAMPAIGN_TYPES = [
  '', 'Tech', 'Education', 'Health', 'Art', 'Social Good', 'Environment', 'Startups', 'Student Life', 'Others'
];

function UserHome() {
  // Filters
  const [type, setType] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableStates, setAvailableStates] = useState({});
  const [availableCities, setAvailableCities] = useState({});
  const [filterLoading, setFilterLoading] = useState(true);
  const [filterError, setFilterError] = useState('');

  // State for discovery campaigns
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Details modal state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Fetch available countries, states, and cities for filters
  useEffect(() => {
    setFilterLoading(true);
    setFilterError('');
    fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/available-countries-states`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.error || 'Failed to fetch filter data');
        setAvailableCountries(['', ...data.countries]);
        setAvailableStates(data.states || {});
        setAvailableCities(data.cities || {});
      })
      .catch(err => setFilterError(err.message || 'Failed to fetch filter data'))
      .finally(() => setFilterLoading(false));
  }, []);

  // Fetch campaigns with filters
  useEffect(() => {
    setLoading(true);
    setError('');
    const params = [];
    if (type) params.push(`type=${encodeURIComponent(type)}`);
    if (country) params.push(`country=${encodeURIComponent(country)}`);
    if (state) params.push(`state=${encodeURIComponent(state)}`);
    if (city) params.push(`city=${encodeURIComponent(city)}`);
    const query = params.length ? `&${params.join('&')}` : '';
    fetch(`${import.meta.env.VITE_API_URL}/api/campaigns?sort=new&limit=6${query}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.error || 'Failed to fetch campaigns');
        setCampaigns(data.campaigns);
      })
      .catch(err => setError(err.message || 'Failed to fetch campaigns'))
      .finally(() => setLoading(false));
  }, [type, country, state, city]);

  // Handlers
  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setState('');
    setCity('');
  };
  const handleStateChange = (e) => {
    setState(e.target.value);
    setCity('');
  };

  const handleViewDetails = (campaign) => {
    setSelectedCampaign(campaign);
    setDetailsOpen(true);
  };
  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedCampaign(null);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 1700, mx: 'auto' }}>
      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 160 }} size="small" disabled={filterLoading}>
          <InputLabel>Type</InputLabel>
          <Select value={type} label="Type" onChange={e => setType(e.target.value)}>
            {CAMPAIGN_TYPES.map(t => (
              <MenuItem key={t} value={t}>{t || 'All Types'}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }} size="small" disabled={filterLoading}>
          <InputLabel>Country</InputLabel>
          <Select value={country} label="Country" onChange={handleCountryChange}>
            {availableCountries.map(c => (
              <MenuItem key={c} value={c}>{c || 'All Countries'}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }} size="small" disabled={filterLoading || !country || !availableStates[country] || availableStates[country].length === 0}>
          <InputLabel>State</InputLabel>
          <Select value={state} label="State" onChange={handleStateChange}>
            {(['', ...(availableStates[country] || [])]).map(s => (
              <MenuItem key={s} value={s}>{s || 'All States'}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }} size="small" disabled={filterLoading || !country || !state || !availableCities[country] || !availableCities[country][state] || availableCities[country][state].length === 0}>
          <InputLabel>City</InputLabel>
          <Select value={city} label="City" onChange={e => setCity(e.target.value)}>
            {(['', ...(availableCities[country] && availableCities[country][state] ? availableCities[country][state] : [])]).map(cityOpt => (
              <MenuItem key={cityOpt} value={cityOpt}>{cityOpt || 'All Cities'}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      {filterError && <Alert severity="error" sx={{ mb: 2 }}>{filterError}</Alert>}

      {/* New & Noteworthy Campaigns */}
      <Typography variant="h4" fontWeight={900} sx={{ mb: 2 }}>
        New & Noteworthy Campaigns
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : campaigns.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No campaigns found.
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {campaigns.map((campaign) => (
            <Grid item xs={12} sm={6} md={4} key={campaign._id}>
              <CampaignCard
                campaign={campaign}
                mode="other"
                onViewDetails={() => handleViewDetails(campaign)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CampaignDetailsModal
        open={detailsOpen}
        campaign={selectedCampaign}
        onClose={handleCloseDetails}
      />

      <Divider sx={{ my: 4 }} />

      {/* Tips or Platform Updates */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
          Tips for Success
        </Typography>
        <Typography variant="body2" color="text.secondary">
          - Make your campaign title short and memorable.<br />
          - Use high-quality photos to attract more backers.<br />
          - Share your campaign with friends and on social media.<br />
          - Be transparent and update your supporters regularly.<br />
        </Typography>
      </Box>
    </Box>
  );
}

export default UserHome;
