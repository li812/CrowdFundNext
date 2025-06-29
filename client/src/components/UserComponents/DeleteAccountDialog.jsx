import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import { auth } from '../../utils/firebase';
import { reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';

const DeleteAccountDialog = () => {
  const [open, setOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleDeleteAccount = async () => {
    setDeleteError('');
    setDeleteSuccess('');
    if (!deletePassword) {
      setDeleteError('Password is required.');
      return;
    }
    if (deleteConfirm !== 'DELETE') {
      setDeleteError('Type DELETE to confirm.');
      return;
    }
    try {
      const user = auth.currentUser;
      const cred = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(user, cred);
      await deleteUser(user);
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
    <Box>
      <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
        Delete Account
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action is <b>irreversible</b>. All your data will be deleted. Please confirm your password and type <b>DELETE</b> to proceed.
          </Alert>
          {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
          <TextField
            label="Password"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            value={deletePassword}
            onChange={e => setDeletePassword(e.target.value)}
          />
          <TextField
            label="Type DELETE to confirm"
            fullWidth
            value={deleteConfirm}
            onChange={e => setDeleteConfirm(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      {deleteSuccess && <Alert severity="success" sx={{ mt: 2 }}>{deleteSuccess}</Alert>}
    </Box>
  );
};

export default DeleteAccountDialog; 