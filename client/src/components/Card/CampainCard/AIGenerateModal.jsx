import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, CircularProgress, Grid, Typography, Stack
} from '@mui/material';

// Real AI generation function
const generateWithAI = async (prompt) => {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${apiUrl}/api/ai/generate-campaign-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to generate suggestions.');
  }
  return res.json();
};

const TITLE_MIN = 10;
const TITLE_MAX = 25;
const DESC_MIN = 100;
const DESC_MAX = 250;

function AIGenerateModal({ open, onClose, onSelect }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setError('');
    setLoading(true);
    setResults(null);
    try {
      const res = await generateWithAI(prompt);
      setResults(res);
    } catch (e) {
      setError(e.message || 'Failed to generate suggestions.');
    } finally {
      setLoading(false);
    }
  };

  const handleUse = (field, value) => {
    onSelect(field, value);
    onClose();
  };

  const handleClose = () => {
    setPrompt('');
    setResults(null);
    setError('');
    setLoading(false);
    onClose();
  };

  const isTitleValid = (title) => title.length >= TITLE_MIN && title.length <= TITLE_MAX;
  const isDescValid = (desc) => desc.length >= DESC_MIN && desc.length <= DESC_MAX;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Generate Campaign Content with AI</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            label="Describe your campaign idea"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            disabled={loading}
            autoFocus
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            sx={{ alignSelf: 'flex-start' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate'}
          </Button>
          {results && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>AI Title Suggestions</Typography>
                <Stack spacing={1}>
                  {results.titles.map((title, idx) => (
                    <Stack key={idx} direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ flex: 1, color: isTitleValid(title) ? 'inherit' : 'error.main', fontWeight: isTitleValid(title) ? 400 : 700 }}>
                        {title} {isTitleValid(title) ? '' : `(Length: ${title.length}/${TITLE_MIN}-${TITLE_MAX})`}
                      </Typography>
                      <Button size="small" variant="outlined" onClick={() => handleUse('title', title)} disabled={!isTitleValid(title)}>
                        Use this
                      </Button>
                    </Stack>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>AI Description Suggestions</Typography>
                <Stack spacing={1}>
                  {results.descriptions.map((desc, idx) => (
                    <Stack key={idx} direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ flex: 1, color: isDescValid(desc) ? 'inherit' : 'error.main', fontWeight: isDescValid(desc) ? 400 : 700 }}>
                        {desc} {isDescValid(desc) ? '' : `(Length: ${desc.length}/${DESC_MIN}-${DESC_MAX})`}
                      </Typography>
                      <Button size="small" variant="outlined" onClick={() => handleUse('description', desc)} disabled={!isDescValid(desc)}>
                        Use this
                      </Button>
                    </Stack>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AIGenerateModal; 