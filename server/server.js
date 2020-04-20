// Various imports
const express = require('express');
let timeout = require('connect-timeout');
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

// Create Xero OAuth1.0 Client
let xeroClient = new XeroClient({
  appType: 'public',
  callbackUrl: 'http://localhost:3000/callback',
  consumerKey: process.env.consumerKey,
  consumerSecret: process.env.consumerSecret,
  userAgent: 'Tester (PUBLIC) - Application for testing Xero',
  redirectOnError: true,
});

// Express server configuration
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(timeout(240000));
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

// Connect to Xero and obtain + go to the authorisation URL
app.get('/connect', async function (req, res) {
  lastRequestToken = await xeroClient.oauth1Client.getRequestToken();

  let authoriseUrl = xeroClient.oauth1Client.buildAuthoriseUrl(
    lastRequestToken
  );
  res.json(authoriseUrl);
});

// Callback URL contains token and we take user back to the / route
app.get('/callback', async function (req, res) {
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
        where: `Date >= DateTime(${year}, ${month}, 01) && Date < DateTime(${year}, ${month}, ${finalDay})`,
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

function voidInvoice(invoiceID, idx) {
  try {
    console.log(`Voiding ${invoiceID}`);

    xeroClient.invoices.update({
      InvoiceID: invoiceID,
      Status: 'VOIDED',
    });

    return `Success ${invoiceID} waited ${2000}ms`;
  } catch (exc) {
    console.log(exc);
    return `Failed ${invoiceID}`;
  }
}

// Send request to Xero to void every invoice in the Array
app.post('/void', async function (req, res) {
  // array of invoice ids to void
  let invoicesToVoid = req.body.void;

  try {
    const promises = invoicesToVoid.map(
      (invoiceID, idx) =>
        // void the invoices staggered for 1.5s x index in array
        new Promise((resolve) =>
          setTimeout(() => {
            let status = voidInvoice(invoiceID, idx);
            console.log(status);
            resolve(status);
          }, idx * 1500)
        )
    );
    // once all promises are resolved, let the frontend know
    Promise.all(promises).then(() => {
      console.log(promises);
      console.log(`promises above`);
      res.status(200).send('Success');
      // const failureCheck = promises.findIndex((element) =>
      //   element.includes('Failed')
      // );

      // if (failureCheck === -1) {
      //   res.status(200).send('Success');
      // } else {
      //   res.status(200).send({ error: promises[failureCheck] });
      // }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error');
  }
});

module.exports = app;
