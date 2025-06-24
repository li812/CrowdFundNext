const admin = require('firebase-admin');
const serviceAccount = require('../crowdfundnext-firebase-adminsdk-fbsvc-32b968e168.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;