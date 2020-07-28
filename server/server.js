// Various imports
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const XeroClient = require('xero-node').AccountingAPIClient;
const path = require('path');

const app = express();

let lastRequestToken = null;
dotenv.config({ path: './config/config.env' });

// Finds length of month - required to query invoices from Xero API without error
function daysInMonth(month, year) {
  // Use 1 for January, 2 for February, etc.
  return new Date(year, month, 0).getDate();
}

let cbDomain =
  process.env.NODE_ENV === 'development'
    ? process.env.callbackDomainTest
    : process.env.NODE_ENV === 'uat'
    ? process.env.callbackDomainUat
    : process.env.callbackDomainProd;

// Create Xero OAuth1.0 Client
let xeroClient = new XeroClient({
  appType: 'public',
  callbackUrl: `${cbDomain}/callback`,
  consumerKey: process.env.consumerKey,
  consumerSecret: process.env.consumerSecret,
  userAgent: 'Tester (PUBLIC) - Application for testing Xero',
  redirectOnError: true,
});

// Configuration using production build
const root = require('path').join(__dirname, '/../client', 'build');
app.use(express.static(root));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to Xero and obtain + go to the authorisation URL
app.get('/connect', async function (req, res) {
  lastRequestToken = await xeroClient.oauth1Client.getRequestToken();

  let authoriseUrl = xeroClient.oauth1Client.buildAuthoriseUrl(
    lastRequestToken
  );
  res.json(authoriseUrl);
});

// Callback URL contains token and we take user back to the / route
app.get('/api/callback', async function (req, res) {
  console.log(req.query);
  let oauth_verifier = req.query.oauth_verifier;
  let accessToken = await xeroClient.oauth1Client.swapRequestTokenforAccessToken(
    lastRequestToken,
    oauth_verifier
  );
  res.json(accessToken);
});

// Get Authorised invoices by ID (Only authorised invoices can be voided)
app.get('/invoices', async function (req, res) {
  const { date } = req.query;
  // To get invoices for the month we need the first and last days
  const year = date.substring(0, 4);
  const month = date.substring(5, 7);
  const finalDay = daysInMonth(month, year);
  // Paginate and fill a list of invoices to return
  let page = 1;
  let listOfInvoices = [];
  try {
    while (true) {
      let invoices = await xeroClient.invoices.get({
        Statuses: 'AUTHORISED',
        page: page,
        where: `Date >= DateTime(${year}, ${month}, 01) && Date <= DateTime(${year}, ${month}, ${finalDay})`,
      });
      listOfInvoices.push(...invoices.Invoices);
      // fill multiple pages if exists
      if (invoices.Invoices.length < 100) {
        break;
      } else {
        page = page + 1;
      }
    }
    res.json(listOfInvoices);
  } catch (ex) {
    res
      .status(500)
      .send(
        'We encountered an issue retrieving invoices. Please re-authenticate and try again.'
      );
  }
});

function voidInvoice(invoiceID) {
  // Uses SDK to void invoices, returns a promise with fail or success which will be checked later on
  try {
    xeroClient.invoices.update({
      InvoiceID: invoiceID,
      Status: 'VOIDED',
    });

    return `Success ${invoiceID}`;
  } catch (exc) {
    return `Failed ${invoiceID}`;
  }
}

// Send request to Xero to void every invoice in the Array
app.post('/void', async function (req, res) {
  // array of invoice ids to void
  let invoicesToVoid = req.body.void;

  try {
    // With current solution only one id comes through making the map redundant
    // but I'm leaving it here in case folks want to use this endpoint and send an array of invoice IDs locally
    // without worrying about long running HTTP calls
    const promises = invoicesToVoid.map(
      (invoiceID, idx) =>
        new Promise((resolve, reject) => {
          let status = voidInvoice(invoiceID, idx);
          // check to see if api call success/fail
          if (status.includes('Success')) {
            resolve(status);
          } else {
            reject(status);
          }
        })
    );
    // once all promises are resolved, let the frontend know
    Promise.all(promises)
      .then(() => {
        res.status(200).send('Success');
      })
      .catch((err) => {
        // catches the rejection from our promise
        res.status(200).send({ error: err });
      });
  } catch (err) {
    // Overall catch for the route
    res.status(500).send('Error');
  }
});

// Fallback route to serve index page on unknown routes
app.get('*', (req, res) => {
  res.sendFile('index.html', { root });
});

module.exports = app;
