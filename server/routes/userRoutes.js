const express = require('express');
const { upload } = require('../services/fileService');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const { registerUser, getCurrentUser, deleteCurrentUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', verifyFirebaseToken, upload.single('profilePicture'), registerUser);
router.get('/me', verifyFirebaseToken, getCurrentUser);
router.delete('/me', verifyFirebaseToken, deleteCurrentUser);

module.exports = router;