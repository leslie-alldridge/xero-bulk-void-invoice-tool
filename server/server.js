const express = require('express');
const XeroClient = require('xero-node').AccountingAPIClient;
const config = require('../config.json');

let app = express();

let lastRequestToken = null;
let xeroClient = new XeroClient(config);

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
  res.send('<a href="/connect">Connect to Xero</a>');
});

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

  let organisations = await xeroClient.organisations.get();
  let invoices = await xeroClient.invoices.get();

  let lastInvoiceNumber = invoices.Invoices[0].InvoiceNumber;
  res.send(
    'Hello, ' +
      organisations.Organisations[0].Name +
      ". You're last invoice was " +
      lastInvoiceNumber
  );
});

// app.listen(app.get('port'), function() {
//   console.log(
//     'Your Xero basic public app is running at http://localhost:' +
//       app.get('port')
//   );
// });

module.exports = app;
