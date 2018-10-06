const path = require('path');
const express = require('express');
const session = require('express-session');
const XeroClient = require('xero-node').AccountingAPIClient;
const server = express();

server.use(
  session({
    secret: 'something crazy',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);
server.use(express.json());
server.use(express.static(path.join(__dirname, '../public')));

const config = require('../config.json');

(async () => {
  let xero = new XeroClient(config);

  // Create request token and get an authorisation URL
  const requestToken = await xero.oauth1Client.getRequestToken();
  console.log('Received Request Token:', requestToken);

  authUrl = xero.oauth1Client.buildAuthoriseUrl(requestToken);
  console.log('Authorisation URL:', authUrl);

  // Send the user to the Authorisation URL to authorise the connection

  // Once the user has authorised your app, swap Request token for Access token
  const oauth_verifier = 123456;
  const savedRequestToken = {
    oauth_token: '23231aesrfaw',
    oauth_token_secret: 'bbb'
  };
  const accessToken = await xero.oauth1Client.swapRequestTokenforAccessToken(
    savedRequestToken,
    oauth_verifier
  );
  console.log('Received Access Token:', accessToken);

  // You should now store the access token securely for the user.

  // You can make API calls straight away
  const result = await xero.invoices.get();
  console.log('Number of invoices:', result.Invoices.length);

  // You can refresh your access token when it's getting close to expiring
  if (new Date() - accessToken.oauth_expires_at > 60 * 30 * 1000) {
    let newToken = await xero.oauth1Client.refreshAccessToken();
    // Remember to store the new access token in your data store
  }

  // The SDK will hold the latest acess token, so you can make more calls
  const result1 = await xero.invoices.get();
  console.log('Number of invoices:', result1.Invoices.length);

  // When making future calls, you can initialise the Xero client direectly with the stored access token:

  const storedAccessToken = {
    oauth_token: 'aaa',
    oauth_token_secret: 'bbb',
    oauth_session_handle: 'ccc',
    oauth_expires_at: '2018-01-01T01:02:03'
  };
  const xero2 = new XeroClient(config, storedAccessToken);
  const invoices = await xero2.invoices.get();
  console.log('Number of invoices:', invoices.Invoices.length);
})();

module.exports = server;
