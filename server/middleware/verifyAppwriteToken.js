const sdk = require('node-appwrite');

const verifyAppwriteToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT.replace(/"/g, ''))
    .setProject(process.env.APPWRITE_PROJECT_ID.replace(/"/g, ''));

  const account = new sdk.Account(client);

  try {
    client.setJWT(token);
    const user = await account.get();
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = verifyAppwriteToken;