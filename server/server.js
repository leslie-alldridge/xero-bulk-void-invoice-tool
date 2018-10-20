const express = require('express');
const XeroClient = require('xero-node').AccountingAPIClient;
const path = require('path');
let app = express();

let lastRequestToken = null;
let xeroClient = new XeroClient({
  appType: 'public',
  callbackUrl: 'https://bulkvoidxero.herokuapp.com/callback',
  consumerKey: process.env.consumerKey,
  consumerSecret: process.env.consumerSecret,
  userAgent: 'Tester (PUBLIC) - Application for testing Xero',
  redirectOnError: true
});
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/connect', async function(req, res) {
  lastRequestToken = await xeroClient.oauth1Client.getRequestToken();

  let authoriseUrl = xeroClient.oauth1Client.buildAuthoriseUrl(
    lastRequestToken
  );
  res.redirect(authoriseUrl);
});

app.get('/callback', async function(req, res) {
  let oauth_verifier = req.query.oauth_verifier;
  let accessToken = await xeroClient.oauth1Client.swapRequestTokenforAccessToken(
    lastRequestToken,
    oauth_verifier
  );
  res.redirect('/');
});

app.get('/invoices/:id', async function(req, res) {
  let invoices = await xeroClient.invoices.get({
    Statuses: 'AUTHORISED',
    page: req.params.id
  });
  res.json(invoices);
});

app.post('/void', async function(req, res) {
  let toVoid = req.body.void;
  try {
    for (let i = 0; i < toVoid.length; i++) {
      xeroClient.invoices.update({
        InvoiceID: toVoid[i],
        Status: 'VOIDED'
      });
    }
    res.json('Invoice(s) Voided');
  } catch (ex) {
    res.json(ex);
  }
});

module.exports = app;
