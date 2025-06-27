import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
console.log('PayPal Client ID:', clientId);

function DonationAmountModal({ open, onClose, maxAmount, campaign, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [showPayPal, setShowPayPal] = useState(false);

  const handleNext = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (num > maxAmount) {
      setError(`Amount cannot exceed $${maxAmount}`);
      return;
    }
    setError('');
    setShowPayPal(true);
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    setShowPayPal(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Donate to {campaign?.title || 'Campaign'}</DialogTitle>
      <DialogContent>
        {!showPayPal ? (
          <>
            <Typography gutterBottom>How much would you like to donate?</Typography>
            <TextField
              label="Amount (USD)"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              fullWidth
              inputProps={{ min: 1, max: maxAmount, step: 1 }}
              error={!!error}
              helperText={error}
              autoFocus
            />
            <Typography variant="caption" color="text.secondary">
              Maximum allowed: ${maxAmount}
            </Typography>
          </>
        ) : (
          <PayPalScriptProvider options={{ 'client-id': clientId }}>
            <PayPalButtons
              style={{ layout: 'vertical' }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{ amount: { value: String(amount) } }],
                });
              }}
              onApprove={async (data, actions) => {
                await actions.order.capture();
                onSuccess && onSuccess(parseFloat(amount));
                handleClose();
              }}
              onError={() => {
                alert('Payment failed. Please try again.');
                handleClose();
              }}
            />
          </PayPalScriptProvider>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        {!showPayPal && <Button onClick={handleNext} variant="contained">Next</Button>}
      </DialogActions>
    </Dialog>
  );
}

export default DonationAmountModal; 