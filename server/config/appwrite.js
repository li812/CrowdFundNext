const sdk = require('node-appwrite');

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT.replace(/"/g, ''))
  .setProject(process.env.APPWRITE_PROJECT_ID.replace(/"/g, ''))
  .setKey(process.env.APPWRITE_API_KEY.replace(/"/g, ''));

const users = new sdk.Users(client);
const jwt = new sdk.JWT(client);

module.exports = { client, users, jwt };