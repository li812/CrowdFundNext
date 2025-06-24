const express = require('express');
const { upload } = require('../services/fileService');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const { registerUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', verifyFirebaseToken, upload.single('profilePicture'), registerUser);

module.exports = router;