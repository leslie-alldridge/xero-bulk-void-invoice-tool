# xero-bulk-void-invoice-tool

## Things to note

- This application runs on a free Heroku instance so the first load will take ~30 seconds
- Software comes with no warranty and is used at your own risk
- Not affiliated with Xero in any way shape or form
- This was built to suit my personal needs but if it helps you, you're welcome to use it
- Questions or feature requests are welcome
- Uses OAuth1.0 which will deprecate in December 2020 - Undecided whether I'll upgrade it or not
- You can view the progress of a void job in your web browser dev tools console - I left some logs there for those interested

## Technology

- React/Redux
- Node backend
- Xero Node SDK (for all API calls and authentication)
- NO data persistence or database (I don't want users information or tokens) and that's why every time you need to re-auth manually
- [Localstorage](https://stackoverflow.com/questions/17139519/what-is-localstorage) to hold your API key (expires after 30 minutes and deletes on error / disconnect from Xero button click)

## Use cases

As the title suggests, this will bulk void invoices. There is a limit of 60 calls / minute via the Xero API so my code sends a call every 1.2 seconds, making it impossible to exceed 60 per minute.

## Questions

Can I unvoid an invoice - NO (so be careful please)

Does this functionality exist in Xero - NO

Can I distribute this software/code - NO

Am I able to build on top of what you already have - YES as long as it's NOT later sold / charged out. You should be promoting open source. If you want to profit, make your own thing from scratch.

The code broke - Raise an issue, pull request or contact me

## Running this locally

You can run the code locally from the root directory by using `npm run dev`. You'll likely need to run `npm i` in both the `root directory` and `client` directory to get all the node_modules required in this project. Since there's no HTTP duration limits locally you could remove the batched calls from the react frontend and just do one massive call to `/void` with hundreds / thousands of invoice ids.

Please see [my local environment documentation](/docs/localenv.md)

## Deployment

Please see [the documentation](/docs/deployment.md)

## Notes to self

- Migrate to OAuth2
