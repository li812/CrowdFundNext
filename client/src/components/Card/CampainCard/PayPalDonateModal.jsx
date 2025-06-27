import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

function PayPalDonateModal({ open, onClose, amount, campaign }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Donate to {campaign?.title || 'Campaign'}</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>Enter your PayPal details to donate <b>${amount}</b> to this campaign.</Typography>
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
              alert('Thank you for your donation!');
              onClose();
            }}
            onError={(err) => {
              alert('Payment failed. Please try again.');
              onClose();
            }}
          />
        </PayPalScriptProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PayPalDonateModal; 