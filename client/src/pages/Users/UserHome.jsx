import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert, Divider, MenuItem, Select, FormControl, InputLabel, Stack, Button, Chip } from '@mui/material';
import { Refresh, Clear } from '@mui/icons-material';
import CampaignCard from '../../components/Card/CampainCard/CampainCard';
import CampaignDetailsModal from '../../components/Card/CampainCard/CampaignDetailsModal';
// Optionally import country-state-city for real data
// import { Country, State } from 'country-state-city';

const CAMPAIGN_TYPES = [
  '', 'Tech', 'Education', 'Health', 'Art', 'Social Good', 'Environment', 'Startups', 'Student Life', 'Others'
];

const SORT_OPTIONS = [
  { value: 'new', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'ending', label: 'Ending Soon' },
  { value: 'urgent', label: 'Urgent (Ending Soon & Not Funded)' }
];

function UserHome() {
  // Filters
  const [type, setType] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [sort, setSort] = useState('new');
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableStates, setAvailableStates] = useState({});
  const [availableCities, setAvailableCities] = useState({});
  const [filterLoading, setFilterLoading] = useState(true);
  const [filterError, setFilterError] = useState('');

  // State for discovery campaigns
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Details modal state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Ref to track if this is the initial load
  const isInitialLoad = useRef(true);
  const currentFilters = useRef({ type, country, state, city, sort });

  // Get authentication token
  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    return token;
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('jwt');
  }, []);

  // Fetch available countries, states, and cities for filters
  const fetchFilterData = useCallback(async () => {
    if (!isAuthenticated()) {
      setFilterError('Please log in to view campaigns');
      setFilterLoading(false);
      return;
    }

    setFilterLoading(true);
    setFilterError('');
    try {
      const token = getAuthToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/campaigns/available-countries-states`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch filter data');
      
      setAvailableCountries(['', ...data.countries]);
      setAvailableStates(data.states || {});
      setAvailableCities(data.cities || {});
    } catch (err) {
      console.error('Filter data error:', err);
      setFilterError(err.message || 'Failed to fetch filter data');
      // Set default empty arrays so the component can still function
      setAvailableCountries(['']);
      setAvailableStates({});
      setAvailableCities({});
    } finally {
      setFilterLoading(false);
    }
  }, [getAuthToken, isAuthenticated]);

  // Fetch campaigns with filters
  const fetchCampaigns = useCallback(async (resetPage = false, filterParams = null) => {
    if (!isAuthenticated()) {
      setError('Please log in to view campaigns');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    
    // Use provided filter params or current state
    const currentType = filterParams?.type ?? type;
    const currentCountry = filterParams?.country ?? country;
    const currentState = filterParams?.state ?? state;
    const currentCity = filterParams?.city ?? city;
    const currentSort = filterParams?.sort ?? sort;
    const currentPage = resetPage ? 1 : page;
    
    const params = [];
    if (currentType) params.push(`type=${encodeURIComponent(currentType)}`);
    if (currentCountry) params.push(`country=${encodeURIComponent(currentCountry)}`);
    if (currentState) params.push(`state=${encodeURIComponent(currentState)}`);
    if (currentCity) params.push(`city=${encodeURIComponent(currentCity)}`);
    params.push(`sort=${currentSort}`);
    params.push(`page=${currentPage}`);
    const query = params.length ? `&${params.join('&')}` : '';
    
    try {
      const token = getAuthToken();
      const url = `${import.meta.env.VITE_API_URL}/api/campaigns?sort=${currentSort}&limit=6${query}`;
      console.log('Fetching campaigns from:', url);
      
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Response status:', res.status);
      
      if (res.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      
      const data = await res.json();
      console.log('Campaign data:', data);
      
      if (!data.success) throw new Error(data.error || 'Failed to fetch campaigns');
      
      if (resetPage) {
        setCampaigns(data.campaigns);
        setPage(1);
      } else {
        setCampaigns(prev => [...prev, ...data.campaigns]);
      }
      
      setHasMore(data.campaigns.length === 6); // If we got less than 6, there are no more
    } catch (err) {
      console.error('Campaign fetch error:', err);
      setError(err.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  }, [getAuthToken, isAuthenticated, type, country, state, city, sort, page]);

  // Load more campaigns
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setType('');
    setCountry('');
    setState('');
    setCity('');
    setSort('new');
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchCampaigns(true);
    fetchFilterData();
    isInitialLoad.current = false;
  }, []);

  // Handle filter changes
  useEffect(() => {
    if (!isInitialLoad.current) {
      // Check if filters actually changed
      const newFilters = { type, country, state, city, sort };
      const filtersChanged = JSON.stringify(newFilters) !== JSON.stringify(currentFilters.current);
      
      if (filtersChanged) {
        currentFilters.current = newFilters;
        fetchCampaigns(true, newFilters);
      }
    }
  }, [type, country, state, city, sort, fetchCampaigns]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1 && !isInitialLoad.current) {
      fetchCampaigns(false, currentFilters.current);
    }
  }, [page, fetchCampaigns]);

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

  // Check if any filters are active
  const hasActiveFilters = type || country || state || city || sort !== 'new';

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 1700, mx: 'auto' }}>
      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap', mb: 2 }}>
          <FormControl sx={{ minWidth: 160 }} size="small" disabled={filterLoading}>
            <InputLabel>Type</InputLabel>
            <Select value={type} label="Type" onChange={e => setType(e.target.value)}>
              {CAMPAIGN_TYPES.map(t => (
                <MenuItem key={t} value={t}>{t || 'All Types'}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 160 }} size="small" disabled={filterLoading}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sort} label="Sort By" onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 160 }} size="small" disabled={filterLoading}>
            <InputLabel>Country</InputLabel>
            <Select value={country} label="Country" onChange={handleCountryChange}>
              {availableCountries.length > 0 ? (
                availableCountries.map(c => (
                  <MenuItem key={c} value={c}>{c || 'All Countries'}</MenuItem>
                ))
              ) : (
                <MenuItem value="">No countries available</MenuItem>
              )}
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
        
        {/* Filter Actions */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {hasActiveFilters && (
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={resetFilters}
              size="small"
            >
              Clear Filters
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => fetchCampaigns(true, currentFilters.current)}
            disabled={loading}
            size="small"
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* Error Messages */}
      {filterError && <Alert severity="error" sx={{ mb: 2 }}>{filterError}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Active filters:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {type && <Chip label={`Type: ${type}`} size="small" onDelete={() => setType('')} />}
            {country && <Chip label={`Country: ${country}`} size="small" onDelete={() => setCountry('')} />}
            {state && <Chip label={`State: ${state}`} size="small" onDelete={() => setState('')} />}
            {city && <Chip label={`City: ${city}`} size="small" onDelete={() => setCity('')} />}
            {sort !== 'new' && <Chip label={`Sort: ${SORT_OPTIONS.find(s => s.value === sort)?.label}`} size="small" onDelete={() => setSort('new')} />}
          </Stack>
        </Box>
      )}

      {/* New & Noteworthy Campaigns */}
      <Typography variant="h4" fontWeight={900} sx={{ mb: 2 }}>
        {sort === 'urgent' ? 'Urgent Campaigns' : 
         sort === 'ending' ? 'Ending Soon' : 
         sort === 'popular' ? 'Popular Campaigns' : 
         'New & Noteworthy Campaigns'}
      </Typography>
      
      {loading && page === 1 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : campaigns.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No campaigns found.
        </Typography>
      ) : (
        <>
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
          
          {/* Load More Button */}
          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={loadMore}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                {loading ? 'Loading...' : 'Load More Campaigns'}
              </Button>
            </Box>
          )}
        </>
      )}

      <CampaignDetailsModal
        open={detailsOpen}
        campaign={selectedCampaign}
        onClose={handleCloseDetails}
      />

      <Divider sx={{ my: 4 }} />
    </Box>
  );
}

export default UserHome;
