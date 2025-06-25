const admin = require('../config/firebase');

async function setUserTypeClaim(uid, userType = 'user') {
  const user = await admin.auth().getUser(uid);
  if (!user.customClaims || user.customClaims.userType !== userType) {
    await admin.auth().setCustomUserClaims(uid, { userType });
  }
}

// Delete a user from Firebase Auth by UID
async function deleteFirebaseUser(uid) {
  try {
    await admin.auth().deleteUser(uid);
    return true;
  } catch (err) {
    throw new Error('Failed to delete user from Firebase: ' + err.message);
  }
}

module.exports = { setUserTypeClaim, deleteFirebaseUser };