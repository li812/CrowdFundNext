import React from 'react';
import { Fab, Box } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useChatBot } from '../ChatBotProvider';

function ChatBotFloatingButton() {
  const { open, setOpen } = useChatBot();

  if (open) return null;

  return (
    <Box sx={{
      position: 'fixed',
      bottom: 32,
      right: 32,
      zIndex: 1300,
    }}>
      <Fab
        color="primary"
        sx={{
          boxShadow: '0 8px 32px 0 #3a86ff44',
          backdropFilter: 'blur(18px) saturate(180%)',
          background: (theme) => theme.palette.background.glass,
        }}
        onClick={() => setOpen(true)}
        aria-label="Open chat"
      >
        <ChatBubbleIcon />
      </Fab>
    </Box>
  );
}

export default ChatBotFloatingButton;
