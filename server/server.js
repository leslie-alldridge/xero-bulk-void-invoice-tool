// Various imports
const express = require('express');
const XeroClient = require('xero-node').AccountingAPIClient;
const path = require('path');
const app = express();

let lastRequestToken = null;

// Create Xero OAuth1.0 Client
let xeroClient = new XeroClient({
  appType: 'public',
  callbackUrl: 'https://bulkvoidxero.herokuapp.com/callback',
  consumerKey: process.env.consumerKey,
  consumerSecret: process.env.consumerSecret,
  userAgent: 'Tester (PUBLIC) - Application for testing Xero',
  redirectOnError: true,
});

// Express server configuration
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Xero and obtain + go to the authorisation URL
app.get('/connect', async function (req, res) {
  lastRequestToken = await xeroClient.oauth1Client.getRequestToken();

  let authoriseUrl = xeroClient.oauth1Client.buildAuthoriseUrl(
    lastRequestToken
  );
  res.redirect(authoriseUrl);
});

// Callback URL contains token and we take user back to the / route
app.get('/callback', async function (req, res) {
  let oauth_verifier = req.query.oauth_verifier;
  let accessToken = await xeroClient.oauth1Client.swapRequestTokenforAccessToken(
    lastRequestToken,
    oauth_verifier
  );
  res.redirect('/');
});

// Get Authorised invoices by ID (Only authorised invoices can be voided)
app.get('/invoices/:id', async function (req, res) {
  let invoices = await xeroClient.invoices.get({
    Statuses: 'AUTHORISED',
    page: req.params.id,
  });
  res.json(invoices);
});

// Send request to Xero to void every invoice in the Array
app.post('/void', async function (req, res) {
  let toVoid = req.body.void;
  try {
    for (let i = 0; i < toVoid.length; i++) {
      xeroClient.invoices.update({
        InvoiceID: toVoid[i],
        Status: 'VOIDED',
      });
    }
    res.json('Invoice(s) Voided');
  } catch (ex) {
    res.json(ex);
  }
});

module.exports = app;
