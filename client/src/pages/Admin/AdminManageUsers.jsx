import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, IconButton, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Button, Fade
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

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '',
    type: 'user',
    status: 'active',
    country: 'USA',
    state: 'California',
    city: 'San Francisco',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: '',
    type: 'admin',
    status: 'active',
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: '',
    type: 'user',
    status: 'banned',
    country: 'UK',
    state: 'England',
    city: 'London',
  },
  {
    id: '4',
    name: 'Bob Lee',
    email: 'bob@example.com',
    avatar: '',
    type: 'user',
    status: 'active',
    country: 'Canada',
    state: 'Ontario',
    city: 'Toronto',
  },
];

function AdminManageUsers() {
  const theme = useTheme();
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

  // Filter users by search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Handle delete (mock)
  const handleDelete = (user) => {
    setDeleteDialog({ open: true, user });
  };
  const confirmDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== deleteDialog.user.id));
    setDeleteDialog({ open: false, user: null });
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
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminManageUsers;