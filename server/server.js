// Various imports
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { XeroClient, Invoice, Invoices } from 'xero-node';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

dotenv.config({ path: './config/.env' });

// Finds length of month - required to query invoices from Xero API without error
function daysInMonth(month, year) {
  // Use 1 for January, 2 for February, etc.
  return new Date(year, month, 0).getDate();
}

// Scopes and secrets for OAuth2 Client - best practice is to use minimum scopes required, but I've listed them all here
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirectUrl = process.env.REDIRECT_URI;
const scopes = 'openid,profile,email,accounting.transactions';

// Create OAuth2 Client
const xero = new XeroClient({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUris: [redirectUrl],
  scopes: scopes.split(' '),
  state: 'creating-xero-client',
  httpTimeout: 2000,
});

// Configuration using production build
const root = path.join(__dirname, '/../client', 'build');
app.use(express.static(root));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    secret: 'something crazy',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Connect to Xero and obtain + go to the authorisation URL
app.get('/connect', async (req, res) => {
  try {
    const consentUrl = await xero.buildConsentUrl();
    res.send(consentUrl);
  } catch (err) {
    console.log(err);
    res.send('Sorry, something went wrong');
  }
});

// Callback URL contains token and we take user back to the / route
app.get('/callback', async (req, res) => {
  try {
    const consentUrl = await xero.buildConsentUrl();
    const tokenSet = await xero.apiCallback(req.url);
    await xero.updateTenants(false);
    req.session.tokenSet = tokenSet;
    req.session.activeTenant = xero.tenants[0];
    res.redirect('/auth');
  } catch (err) {
    console.log(err);
    res.send('Sorry, something went wrong');
  }
});

app.get('/token', async (req, res) => {
  res.json(req.session.tokenSet);
});

// Get Authorised invoices by ID (Only authorised invoices can be voided)
app.get('/invoices', async function (req, res) {
  try {
    const { date } = req.query;
    // To get invoices for the month we need the first and last days
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const finalDay = daysInMonth(month, year);

    // Paginate and fill a list of invoices to return
    let page = 1;
    let listOfInvoices = [];
    while (true) {
      let invoices = await xero.accountingApi.getInvoices(
        req.session.activeTenant.tenantId,
        undefined,
        `Date >= DateTime(${year}, ${month}, 01) && Date <= DateTime(${year}, ${month}, ${finalDay})`,
        'reference DESC',
        undefined,
        undefined,
        undefined,
        ['AUTHORISED'],
        page,
        true,
        false,
        4,
        {
          headers: {
            contentType: 'application/json',
          },
        }
      );
      invoices = invoices.body.invoices;
      listOfInvoices.push(...invoices);
      // fill multiple pages if exists
      if (invoices.length < 100) {
        break;
      } else {
        page = page + 1;
      }
    }

    res.json(listOfInvoices);
  } catch (ex) {
    console.log(ex);
    res
      .status(500)
      .send(
        'We encountered an issue retrieving invoices. Please re-authenticate and try again.'
      );
  }
});

async function voidInvoice(invoice, req) {
  // Uses SDK to void invoices, returns a promise with fail or success which will be checked later on
  try {
    // first we want to set the invoice object status to voided
    invoice.status = 'VOIDED';
    // next we need to parse all the date strings to date objects or the node SDK fails
    invoice.date = new Date(invoice.date);
    invoice.dueDate = new Date(invoice.dueDate);
    invoice.updatedDateUTC = new Date(invoice.updatedDateUTC);
    // create blueprints for invoices array and invoice object (we are creating an array of objects)
    const newInvoices = new Invoices();
    const newInvoice = new Invoice();
    // copy our invoice data into the blueprint
    Object.assign(newInvoice, invoice);
    newInvoices.invoices = [newInvoice];

    // Now we send the SDK method our tenant id, invoice id, and the structured invoice payload
    let res = await xero.accountingApi.updateInvoice(
      req.session.activeTenant.tenantId,
      invoice.invoiceID,
      newInvoices
    );

    return `Success ${invoice.invoiceID}`;
  } catch (exc) {
    console.log(exc);
    return `Failed ${invoice.invoiceID}`;
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
      (invoice, idx) =>
        new Promise((resolve, reject) => {
          voidInvoice(invoice, req, idx).then((data) => {
            // check to see if api call success/fail
            if (data.includes('Success')) {
              resolve(data);
            } else {
              reject(data);
            }
          });
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

export default app;
