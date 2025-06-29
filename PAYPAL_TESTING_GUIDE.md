# PayPal Sandbox Testing Guide

## 🧪 Testing Donations (Student Project)

This project uses **PayPal Sandbox** for testing donations. No real money is involved!

### ✅ What Should Happen

1. **Click "Donate"** on any campaign
2. **Enter amount** (e.g., $10)
3. **Click "Next"** to proceed to PayPal
4. **PayPal Sandbox page opens** (URL should start with `https://www.sandbox.paypal.com`)
5. **Use test credentials** (see below)
6. **Payment completes** and you see updated progress

### 🔑 PayPal Sandbox Test Accounts

You can use these **fake test accounts**:

#### Personal Account (Buyer):
- **Email**: `sb-personal@business.example.com`
- **Password**: `test123456`

#### Business Account (Seller):
- **Email**: `sb-business@business.example.com`  
- **Password**: `test123456`

### 🚨 Common Issues & Solutions

#### Issue 1: "Real PayPal" instead of Sandbox
**Problem**: You see `https://www.paypal.com` instead of `https://www.sandbox.paypal.com`

**Solution**: 
- Check browser console for errors
- Make sure `environment: 'sandbox'` is set in PayPalScriptProvider
- Verify the client ID is a sandbox client ID

#### Issue 2: "Invalid Client ID" Error
**Problem**: PayPal shows client ID error

**Solution**:
- Check that `VITE_PAYPAL_CLIENT_ID` is set correctly in `client/env.txt`
- Make sure the client ID starts with `Ab6iUYE0QB2...` (sandbox format)
- Restart the development server after changing environment variables

#### Issue 3: Payment Doesn't Update Progress
**Problem**: Payment succeeds but progress bar doesn't update

**Solution**:
- Check browser console for JavaScript errors
- Verify the backend API is running (`http://localhost:3300`)
- Check that JWT token is valid

### 🐛 Debugging Steps

1. **Open Browser Console** (F12)
2. **Look for these logs**:
   ```
   PayPal Client ID: Ab6iUYE0QB2...
   PayPal Environment: SANDBOX (for testing)
   Creating PayPal order for amount: 10
   PayPal payment approved: {...}
   PayPal payment captured successfully
   ```

3. **Check Network Tab** for API calls to `/api/campaigns/donate`

### 🔧 Environment Variables

Make sure these are set in `client/env.txt`:
```
VITE_PAYPAL_CLIENT_ID=Ab6iUYE0QB2iegNMGrQwZlk92uJnNUmPDuuU6y_M-65L8-8-gb8gyzWWli9BqTEhS0_iluKSoEWmBX2y
VITE_API_URL=http://localhost:3300
```

### 📝 Test Scenarios

1. **Small Donation**: Try $1 donation
2. **Large Donation**: Try $100 donation  
3. **Cancel Payment**: Start payment then cancel
4. **Multiple Donations**: Donate to same campaign multiple times
5. **Different Campaigns**: Donate to different campaigns

### 🎯 Success Indicators

✅ **PayPal URL**: `https://www.sandbox.paypal.com/...`
✅ **Test Account Login**: Works with sandbox credentials
✅ **Payment Success**: Shows "Thank you for your donation!"
✅ **Progress Update**: Campaign progress bar increases
✅ **Amount Update**: Shows new total raised
✅ **No Real Money**: No actual charges on your card

### 🆘 Still Having Issues?

1. **Clear browser cache** and try again
2. **Check if backend is running**: `http://localhost:3300/health`
3. **Verify MongoDB connection** in backend logs
4. **Check PayPal Developer Dashboard** for sandbox account status

---

**Remember**: This is sandbox mode - no real money is involved! 🎉 