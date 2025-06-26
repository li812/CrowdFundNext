import React, { useState } from 'react';
import { Box, Card, Typography, Tabs, Tab } from '@mui/material';
import ProfileForm from './components/ProfileForm';
import PasswordChangeDialog from './components/PasswordChangeDialog';
import DeleteAccountDialog from './components/DeleteAccountDialog';

function UserSettings() {
  const [tab, setTab] = useState(0);
  const handleTabChange = (_, newValue) => setTab(newValue);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h4" gutterBottom>User Settings</Typography>
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Edit Profile" />
        <Tab label="Change Password" />
        <Tab label="Delete Account" />
      </Tabs>
      {tab === 0 && <ProfileForm />}
      {tab === 1 && <PasswordChangeDialog />}
      {tab === 2 && <DeleteAccountDialog />}
    </Box>
  );
}

export default UserSettings;

