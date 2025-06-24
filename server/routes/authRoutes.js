const express = require('express');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const router = express.Router();


router.post('/verify', verifyFirebaseToken, (req, res) => {
  const { uid, email, userType } = req.user;
  res.json({
    success: true,
    user_id: uid,
    email,
    userType: userType || 'user'
  });
});

module.exports = router;