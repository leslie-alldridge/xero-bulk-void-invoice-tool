# xero-bulk-void-invoice-tool

## Things to note

- This application runs on a free Heroku instance so the first load will take ~30 seconds
- Software comes with no warranty and is used at your own risk
- Not affiliated with Xero in any way shape or form
- This was built to suit my personal needs but if it helps you, you're welcome to use it
- Questions or feature requests are welcome
- Uses OAuth1.0 which will deprecate in December 2020 - Undecided whether I'll upgrade it or not

## Technology

- React/Redux
- Node backend
- Xero Node SDK (for all API calls and authentication)
- NO data persistence or database (I don't want users information or tokens) and that's why every time you need to re-auth manually

## Use cases

As the title suggests, this will bulk void invoices. There is a limit of 60 calls / minute via the Xero API so my code counts how many invoices are being voided. More than 60 and we'll sleep until a minute has passed, before firing off another 60 calls, and so on.

## Questions

Can I unvoid an invoice - NO (so be careful please)
Does this functionality exist in Xero - NO
Can I distribute this software/code - NO
Am I able to build on top of what you already have - YES as long as it's not later sold / charged out. You should be promoting open source.
The code broke - Raise an issue or contact me

## Deployment

1.

## Notes to self

- Test voiding an invoice via the application once it's already voided in app (test fail response to UI) - Strangely enough the API accepts this and it's fine (DONE)
- Have /test route in frontend (as an example) redirect user to /help page as it currently does not (DONE)
- Deploy to Heroku and document deployment steps
- Delete client_old directory (DONE)
- Fetch the latest list of invoices after a void completes
