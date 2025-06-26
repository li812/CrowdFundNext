const express = require('express');
const { upload } = require('../services/fileService');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const { registerUser, getCurrentUser, deleteCurrentUser, updateCurrentUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', verifyFirebaseToken, upload.single('profilePicture'), registerUser);
router.get('/me', verifyFirebaseToken, getCurrentUser);
router.delete('/me', verifyFirebaseToken, deleteCurrentUser);
router.patch('/me', verifyFirebaseToken, upload.single('profilePicture'), updateCurrentUser);

module.exports = router;