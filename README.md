# xero-bulk-void-invoice-tool-v2-react

## Goals

1. Rebuild my previous bulk void tool that uses express and handlebars, to a modern React web app. 
2. Learn how to authenticate with Xero using React 
3. Provide a clean interface where users can bulk void invoices

## The Idea

Although I was very happy with building a bulk invoice tool, I knew the technologies used were already outdated. For this 
reason, version two will be using React. React provides a lot of extra functionality using state, that my previous
 app doesn't have. Users will now be able to simply filter and adjust what invoices display in the table, before selecting 
 and voiding their invoices.

Personal Notes: 
- checkbox should tick when all rows are manually ticked  DONE
- invoices should add to 'rows' in state before the toggle is pressed DONE
- need to handle error cases in the voidConfirmed method (using res.body) and rendering an error snackbar
- paging for table when invoices list is long (API pages to 100 atm) - server paging done just need table to respond
- setting a time out when voiding over 60 invoices (I think API limit is 60 per minute)
- code tidy 
- tests
- css and other styling
- deploy to Heroku
