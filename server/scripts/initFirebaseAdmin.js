const admin = require('../config/firebase');

const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'Admin@123';

async function ensureAdminUser() {
  try {
    // Try to get the user by email
    let user;
    try {
      user = await admin.auth().getUserByEmail(ADMIN_EMAIL);
      console.log('Admin user already exists:', user.uid);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        // Create the admin user
        user = await admin.auth().createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          emailVerified: true,
          displayName: 'Platform Admin'
        });
        console.log('Admin user created:', user.uid);
      } else {
        throw err;
      }
    }

    // Set custom claim if not already set
    const token = await admin.auth().getUser(user.uid);
    if (token.customClaims && token.customClaims.userType === 'admin') {
      console.log('Admin userType already set.');
    } else {
      await admin.auth().setCustomUserClaims(user.uid, { userType: 'admin' });
      console.log('Admin userType set to admin.');
    }
  } catch (error) {
    console.error('Error ensuring admin user:', error.message);
    process.exit(1);
  }
}

ensureAdminUser().then(() => {
  console.log('Firebase initialization complete.');
});