import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const navItems = [
  { key: 'profile', label: 'Edit Profile' },
  { key: 'password', label: 'Change Password' },
  { key: 'delete', label: 'Delete Account' },
];

const SidebarNav = ({ selected, onSelect }) => (
  <Box sx={{ width: 220, bgcolor: 'white', borderRadius: 2, boxShadow: 2, mr: 4, height: 'fit-content' }}>
    <List>
      {navItems.map(item => (
        <ListItem key={item.key} disablePadding>
          <ListItemButton
            selected={selected === item.key}
            onClick={() => onSelect(item.key)}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Box>
);

export default SidebarNav; 