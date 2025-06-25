import React from 'react';
import { Fab, Box } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useChatBot } from '../ChatBotProvider';
import { useTheme } from '@mui/material/styles';

function ChatBotFloatingButton() {
  const { open, setOpen } = useChatBot();
  const theme = useTheme();

  // Use your palette gradient or fallback
  const gradient = theme.palette.gradient || 'linear-gradient(135deg, #3a86ff, #36f1cd, #ffe066, #ff4d6d)';

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
          boxShadow: theme.palette.glassShadow || '0 8px 32px 0 #3a86ff44',
          backdropFilter: 'blur(18px) saturate(180%)',
          background: theme.palette.background.glass,
          border: `1.5px solid ${theme.palette.glassBorder || 'rgba(255,255,255,0.18)'}`,
          transition: 'box-shadow 0.3s, background 0.3s',
          '&:hover': {
            boxShadow: '0 16px 48px 0 #3a86ff66',
            background: theme.palette.mode === 'dark'
              ? 'rgba(58,134,255,0.18)'
              : 'rgba(58, 133, 255, 0.69)',
          },
        }}
        onClick={() => setOpen(true)}
        aria-label="Open chat"
      >
        <Box
          sx={{
            background: gradient,
            borderRadius: '50%',
            p: 1.1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChatBubbleIcon
            sx={{
              color: '#fff',
              fontSize: 28,
              filter: 'drop-shadow(0 0 6px #3a86ff44)'
            }}
          />
        </Box>
      </Fab>
    </Box>
  );
}

export default ChatBotFloatingButton;
