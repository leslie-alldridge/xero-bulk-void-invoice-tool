### Local environment

To run this application locally you'll need the following

- A directory within the root of this project named `config`
- Within the `/config` directory a file named `.env`

This file should look like the following

```
NODE_ENV=development
PORT=5000
CLIENT_ID=myid
CLIENT_SECRET=shh
REDIRECT_URI=http://localhost:5000/callback
```

Next you will need to update the connect to Xero button
- client/public/index.html lines 8 and 10
- client/src/app.js line 24

React isn't playing nicely with the button so app.js line 24 does a force refresh. The index.html changes were made so I could use the Xero specific button whereas a previous release just had my own manually styled button.