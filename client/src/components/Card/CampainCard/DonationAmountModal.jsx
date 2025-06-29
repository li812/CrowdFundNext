import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Alert } from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
console.log('PayPal Client ID:', clientId);
console.log('PayPal Environment: SANDBOX (for testing)');

function DonationAmountModal({ open, onClose, maxAmount, campaign, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [showPayPal, setShowPayPal] = useState(false);
  const [paypalError, setPaypalError] = useState('');

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
    setPaypalError('');
    setShowPayPal(true);
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    setPaypalError('');
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
          <>
            {paypalError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                PayPal Error: {paypalError}
              </Alert>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Test Mode:</strong> Use PayPal sandbox test accounts. No real money will be charged.
            </Typography>
            <PayPalScriptProvider options={{ 
              'client-id': clientId,
              'currency': 'USD',
              'intent': 'capture',
              'environment': 'sandbox'  // Force sandbox environment
            }}>
              <PayPalButtons
                style={{ layout: 'vertical' }}
                createOrder={(data, actions) => {
                  console.log('Creating PayPal order for amount:', amount);
                  return actions.order.create({
                    purchase_units: [{ amount: { value: String(amount) } }],
                  });
                }}
                onApprove={async (data, actions) => {
                  console.log('PayPal payment approved:', data);
                  try {
                    await actions.order.capture();
                    console.log('PayPal payment captured successfully');
                    onSuccess && onSuccess(parseFloat(amount));
                    handleClose();
                  } catch (err) {
                    console.error('PayPal capture error:', err);
                    setPaypalError('Payment capture failed. Please try again.');
                  }
                }}
                onError={(err) => {
                  console.error('PayPal error:', err);
                  setPaypalError('Payment failed. Please try again.');
                }}
                onCancel={() => {
                  console.log('PayPal payment cancelled');
                  setPaypalError('Payment was cancelled.');
                }}
              />
            </PayPalScriptProvider>
          </>
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