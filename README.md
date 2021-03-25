# xero-bulk-void-invoice-tool (Updated Mar 2021)

## Things to note

- This application runs on a free Heroku instance so the first load will take ~30 seconds
- Software comes with no warranty and is used at your own risk
- Not affiliated with Xero in any way shape or form
- This was built to suit my personal needs but if it helps you, you're welcome to use it
- Questions or feature requests are welcome
- Uses OAuth2.0 and the latest Node SDK
- You can view the progress of a void job in your web browser dev tools console - I left some logs there for those interested
- I have tested voiding 124 invoices with date ranges from the first of the month all the way to the 31st before deployment

## Technology

- React/Redux
- NodeJS backend
- Xero Node SDK OAuth2 (for all API calls and authentication)
- NO data persistence or database (I don't want users information or tokens) and that's why every time you need to re-auth manually
- [Localstorage](https://stackoverflow.com/questions/17139519/what-is-localstorage) to hold your API key (expires after 30 minutes and automatically deletes on error / disconnect from Xero button click)

## Use cases

As the title suggests, this will bulk void invoices. There is a limit of 60 calls / minute via the Xero API so my code sends a call every 1.2 seconds, making it impossible to exceed 60 per minute.

## Questions

Can I unvoid an invoice - NO (so be careful please)

Does this functionality exist in Xero - NO

Can I distribute this software/code to my clients - NO

Am I able to build on top of what you already have - YES as long as it's NOT later sold / charged out. You should be promoting open source. If you want to profit, make your own thing from scratch.

The code broke - Raise an issue, pull request or contact me. My email is on the help page.

Can I unvoid an invoice - Not possible! However, you can view voided invoices in the Xero UI and go to Invoice settings > Copy to and copy it to a new invoice.

## Running this locally

You can run the code locally from the root directory by using `npm run dev`. You'll likely need to run `npm i` in both the `root directory` and `client` directory to get all the node_modules required in this project. Since there's no HTTP duration limits locally you could remove the batched calls from the react frontend and just do one massive call to `/void` with hundreds / thousands of invoice ids.

Please see [my local environment documentation](/docs/localenv.md)

## Deployment

Please see [the documentation](/docs/deployment.md)

## Future release intentions

This tool currently receives both ACCREC and ACCPAY invoices (invoices & bills). I intend to move each resource out into its own table and the Navigation menu would then say "Void Invoices" and "Void Bills" in separate tabs. 
