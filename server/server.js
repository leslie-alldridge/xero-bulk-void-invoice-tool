const express = require('express');
const XeroClient = require('xero-node').AccountingAPIClient;
const config = require('../config.json');
const path = require('path');
const app = express();

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
  // let organisations = await xeroClient.organisations.get();
  // let invoices = await xeroClient.invoices.get();

  // let lastInvoiceNumber = invoices.Invoices[0].InvoiceNumber;
  // res.send(
  //   'Hello, ' +
  //     organisations.Organisations[0].Name +
  //     ". You're last invoice was " +
  //     lastInvoiceNumber
  // );
});

app.get('/help', async function(req, res) {
  let organisations = await xeroClient.organisations.get();
  let invoices = await xeroClient.invoices.get();
  console.log(organisations);
  console.log(invoices);
});

module.exports = app;
