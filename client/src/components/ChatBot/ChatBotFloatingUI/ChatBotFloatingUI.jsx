import React, { useRef, useState, useEffect } from 'react';
import { Box, Paper, IconButton, TextField, CircularProgress, Fade, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useChatBot } from '../ChatBotProvider';

function ChatBotFloatingUI() {
  const { open, setOpen, messages, sendMessage, loading } = useChatBot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  if (!open) return null;

  return (
    <Fade in={open}>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 100,
          right: 32,
          width: 340,
          maxHeight: 500,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1400,
          ...((theme) => ({
            background: theme.palette.background.glass,
            boxShadow: '0 8px 32px 0 #3a86ff44',
            borderRadius: 4,
            backdropFilter: 'blur(18px) saturate(180%)',
          })),
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e3e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700}>Hoppy AI</Typography>
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: 'transparent' }}>
          {messages.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              👋 Hi! I’m Hoppy, your campaign assistant. Ask me anything about crowdfunding!
            </Typography>
          )}
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                mb: 1.5,
                display: 'flex',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  bgcolor: msg.sender === 'user'
                    ? 'primary.main'
                    : 'background.paper',
                  color: msg.sender === 'user'
                    ? 'primary.contrastText'
                    : 'text.primary',
                  maxWidth: '80%',
                  boxShadow: msg.sender === 'user'
                    ? '0 2px 8px #3a86ff22'
                    : '0 1px 4px #e3e8f022',
                  fontSize: '1rem',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-line',
                }}
                dangerouslySetInnerHTML={msg.sender === 'ai'
                  ? { __html: msg.text.replace(/\n/g, '<br/>') }
                  : undefined}
              >
                {msg.sender === 'user' ? msg.text : null}
              </Box>
            </Box>
          ))}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid #e3e8f0', display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type your message…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && input.trim() && !loading) {
                sendMessage(input.trim());
                setInput('');
              }
            }}
            disabled={loading}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          />
          <IconButton
            color="primary"
            disabled={!input.trim() || loading}
            onClick={() => {
              sendMessage(input.trim());
              setInput('');
            }}
            sx={{ ml: 1 }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Fade>
  );
}

export default ChatBotFloatingUI;
