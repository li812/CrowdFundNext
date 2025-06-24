import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import { auth } from '../../utils/firebase';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, deleteUser } from 'firebase/auth';

function UserSettings() {
  // Modal states
  const [openChange, setOpenChange] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Change password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNew, setConfirmNew] = useState('');
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState('');

  // Delete account
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  // Change Password Handler
  const handleChangePassword = async () => {
    setChangeError('');
    setChangeSuccess('');
    if (!currentPassword || !newPassword || !confirmNew) {
      setChangeError('All fields are required.');
      return;
    }
    if (newPassword !== confirmNew) {
      setChangeError('New passwords do not match.');
      return;
    }
    try {
      const user = auth.currentUser;
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      setChangeSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNew('');
      setOpenChange(false);
    } catch (err) {
      setChangeError(err.message || 'Failed to change password.');
    }
  };

  // Delete Account Handler
  const handleDeleteAccount = async () => {
    setDeleteError('');
    setDeleteSuccess('');
    if (!deletePassword) {
      setDeleteError('Password is required.');
      return;
    }
    try {
      const user = auth.currentUser;
      const cred = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(user, cred);
      await deleteUser(user);
      // Optionally: call backend to delete user data
      await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      });
      setDeleteSuccess('Account deleted. Goodbye!');
      localStorage.removeItem('jwt');
      window.location.href = '/';
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account.');
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6, p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h4" gutterBottom>User Settings</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>Manage your account settings below.</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setOpenChange(true)}>
        Change Password
      </Button>
      <br />
      <Button variant="outlined" color="error" onClick={() => setOpenDelete(true)}>
        Delete Account
      </Button>

      {/* Change Password Modal */}
      <Dialog open={openChange} onClose={() => setOpenChange(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {changeError && <Alert severity="error" sx={{ mb: 2 }}>{changeError}</Alert>}
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            value={confirmNew}
            onChange={e => setConfirmNew(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChange(false)}>Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained">Change</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action is <b>irreversible</b>. All your data will be deleted. Please confirm your password to proceed.
          </Alert>
          {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={deletePassword}
            onChange={e => setDeletePassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserSettings;
