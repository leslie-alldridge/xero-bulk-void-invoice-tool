const express = require('express');
const XeroClient = require('xero-node').AccountingAPIClient;
const config = require('../config.json');
const path = require('path');
let app = express();

let lastRequestToken = null;
let xeroClient = new XeroClient(config);

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, '../public')));

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

app.get('/help', async function(req, res) {
  let organisations = await xeroClient.organisations.get();
  let invoices = await xeroClient.invoices.get({
    Statuses: 'AUTHORISED',
    page: '1'
  });
  console.log(invoices.Invoices.length);
});

module.exports = app;
