This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The project in this directory is the Front End for the Xero Bulk Void Invoice Tool

### Components

The main logic lies within InvoiceTable.js as this page needs to know what invoices you have, what you want to void and submit the relevant API calls to do that. In addition, both success and error responses need to be handled as well as user interaction with the table.

At the top level you can see all components relate to their specific pages within the UI.

In the common/ directory you will find generic shared components that may appear across multiple pages.

### CSS

I've decided to choose antd for styling as it does get exhausting only using material design or bootstrap in projects.

### I don't want to queue requests

If you're intending to run this locally / in a place that doesn't have strict HTTP duration timeouts (or if you have a redis cache/similar queue) it is possible to remove the foreach loop from InvoiceTable.js

The backend already supports an array and you could add a timeout to each API call to Xero, but ideally your queue would have the ability to rest between each job.

I decided against adding queueing as I'm unsure how it functions on Heroku. I think they did recently add Redis support but I haven't had time to investigate it further.

### Build / Run

To run only the frontend in development mode you can navigate to the client directory and use `npm run start` to start the create-react-app development server

Alternatively, you can use `npm run build` to get the production build
