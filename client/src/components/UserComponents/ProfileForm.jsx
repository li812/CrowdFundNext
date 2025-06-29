import React, { useState, useRef } from 'react';
import { Box, Button, TextField, Alert, Avatar, Stack, CircularProgress } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useUser } from '../../context/UserContext';

const ProfileForm = () => {
  const user = useUser();
  const [profile, setProfile] = useState(user);
  const [editProfile, setEditProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const getProfilePicUrl = (pic) => {
    if (!pic) return '';
    if (pic.startsWith('http')) return pic;
    return `${apiUrl}${pic}`;
  };
  const [profilePicPreview, setProfilePicPreview] = useState(getProfilePicUrl(user?.profilePicture));
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const fileInputRef = useRef();

  const handleProfileChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleProfilePicChange = e => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };
  const handleEditProfile = () => setEditProfile(true);
  const handleCancelEdit = () => {
    setEditProfile(false);
    setProfile(user);
    setProfilePic(null);
    setProfilePicPreview(getProfilePicUrl(user?.profilePicture));
    setProfileError('');
    setProfileSuccess('');
  };
  const handleSaveProfile = async () => {
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      const formData = new FormData();
      for (const key of ['firstName','lastName','phoneNumber','country','state','city','pincode']) {
        if (profile[key] !== undefined) formData.append(key, profile[key]);
      }
      if (profilePic) formData.append('profilePicture', profilePic);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
        body: formData
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to update profile');
      setProfileSuccess('Profile updated successfully.');
      setEditProfile(false);
      setProfilePic(null);
      setProfilePicPreview(getProfilePicUrl(data.user.profilePicture));
      setProfile(data.user);
      window.location.reload();
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  if (!profile) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Avatar src={profilePicPreview || '/default-avatar.png'} sx={{ width: 80, height: 80 }} />
        <Box>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleProfilePicChange}
            disabled={!editProfile}
          />
          <Button
            variant="outlined"
            startIcon={<PhotoCamera />}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={!editProfile}
          >
            {profilePicPreview ? 'Change Photo' : 'Upload Photo'}
          </Button>
        </Box>
      </Stack>
      <Stack spacing={2}>
        <TextField label="First Name" name="firstName" value={profile.firstName || ''} onChange={handleProfileChange} disabled={!editProfile} />
        <TextField label="Last Name" name="lastName" value={profile.lastName || ''} onChange={handleProfileChange} disabled={!editProfile} />
        <TextField label="Phone Number" name="phoneNumber" value={profile.phoneNumber || ''} onChange={handleProfileChange} disabled={!editProfile} />
        <TextField label="Country" name="country" value={profile.country || ''} onChange={handleProfileChange} disabled={!editProfile} />
        <TextField label="State" name="state" value={profile.state || ''} onChange={handleProfileChange} disabled={!editProfile} />
        <TextField label="City" name="city" value={profile.city || ''} onChange={handleProfileChange} disabled={!editProfile} />
        <TextField label="Pincode" name="pincode" value={profile.pincode || ''} onChange={handleProfileChange} disabled={!editProfile} />
        <TextField label="Email" value={profile.email || ''} disabled />
        <TextField label="Date of Birth" value={profile.dateOfBirth || ''} disabled />
        <TextField label="Gender" value={profile.gender || ''} disabled />
      </Stack>
      {profileError && <Alert severity="error" sx={{ mt: 2 }}>{profileError}</Alert>}
      {profileSuccess && <Alert severity="success" sx={{ mt: 2 }}>{profileSuccess}</Alert>}
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        {!editProfile ? (
          <Button variant="contained" onClick={handleEditProfile}>Edit Profile</Button>
        ) : (
          <>
            <Button variant="contained" onClick={handleSaveProfile} disabled={profileLoading}>
              {profileLoading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
            <Button variant="outlined" onClick={handleCancelEdit} disabled={profileLoading}>Cancel</Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default ProfileForm; 