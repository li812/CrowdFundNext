const express = require('express');
const sdk = require('node-appwrite');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT.replace(/"/g, ''))
    .setProject(process.env.APPWRITE_PROJECT_ID.replace(/"/g, ''))
    .setKey(process.env.APPWRITE_API_KEY.replace(/"/g, ''));

  const users = new sdk.Users(client);

  try {
    // FIX: Use Query.equal for email search
    const userList = await users.list([
      sdk.Query.equal('email', email)
    ]);
    const user = userList.users[0];
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    // Create session and JWT as before
    const session = await users.createEmailSession(user.$id, email, password);
    const userJwt = await users.createJWT(user.$id);

    let userType = 'user';
    if (user.labels && user.labels.includes('admin')) {
      userType = 'admin';
    }

    res.json({
      success: true,
      message: 'Login successful',
      userType,
      user_id: user.$id,
      email: user.email,
      name: user.name,
      appwrite_jwt: userJwt.jwt,
      sessionId: session.$id,
      provider: 'email'
    });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message || 'Login failed' });
  }
});

// Google OAuth login: returns Appwrite OAuth URL
router.get('/login/google', (req, res) => {
  const redirectUrl = req.query.redirect || 'http://localhost:3000';
  const url = `${process.env.APPWRITE_ENDPOINT.replace(/"/g, '')}/account/sessions/oauth2/google?project=${process.env.APPWRITE_PROJECT_ID.replace(/"/g, '')}&success=${encodeURIComponent(redirectUrl)}&failure=${encodeURIComponent(redirectUrl)}`;
  res.json({ url });
});

const verifyAppwriteToken = require('../middleware/verifyAppwriteToken');

router.post('/verify', verifyAppwriteToken, (req, res) => {
  const user = req.user;
  let userType = 'user';
  if (user.labels && user.labels.includes('admin')) {
    userType = 'admin';
  }
  res.json({
    success: true,
    message: 'Token verified',
    userType,
    user_id: user.$id,
    email: user.email,
    name: user.name,
    provider: user.provider || 'email'
  });
});

module.exports = router;