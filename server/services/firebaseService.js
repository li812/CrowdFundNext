const admin = require('../config/firebase');

async function setUserTypeClaim(uid, userType = 'user') {
  const user = await admin.auth().getUser(uid);
  if (!user.customClaims || user.customClaims.userType !== userType) {
    await admin.auth().setCustomUserClaims(uid, { userType });
  }
}

module.exports = { setUserTypeClaim };