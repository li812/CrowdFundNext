import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, IconButton, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Button, Fade, CircularProgress, Alert
} from '@mui/material';
import { Delete, Search } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Glassmorphic style (reuse from dashboard)
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

function AdminManageUsers() {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [deleting, setDeleting] = useState(false);

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch users');
      setUsers(data.users.map(u => ({
        id: u._id,
        name: u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.email,
        email: u.email,
        avatar: u.profilePicture ? `${import.meta.env.VITE_API_URL || ''}${u.profilePicture}` : undefined,
        type: u.userType,
        status: u.status || 'active',
        country: u.country || '',
        state: u.state || '',
        city: u.city || '',
      })));
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users by search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Handle delete
  const handleDelete = (user) => {
    setDeleteDialog({ open: true, user });
  };
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/users/${deleteDialog.user.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to delete user');
      setDeleteDialog({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };
  const cancelDelete = () => setDeleteDialog({ open: false, user: null });

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
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{ mb: 4, letterSpacing: '-1.2px', textAlign: 'left', background: theme.palette.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Users Management
          </Typography>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by name or email"
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
                    <TableCell>Avatar</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>User Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography color="text.secondary">No users found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Avatar src={user.avatar} alt={user.name} sx={{ bgcolor: theme.palette.primary.main }}>
                            {user.name[0]}
                          </Avatar>
                        </TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>{user.type}</TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>{user.status}</TableCell>
                        <TableCell>{user.country}</TableCell>
                        <TableCell>{user.state}</TableCell>
                        <TableCell>{user.city}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(user)}
                            disabled={user.type === 'admin'}
                            title={user.type === 'admin' ? 'Cannot delete admin' : 'Delete user'}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Fade>
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialog.open} onClose={cancelDelete}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <b>{deleteDialog.user?.name}</b>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminManageUsers;