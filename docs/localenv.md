### Local environment

To run this application locally you'll need the following

- A directory within the root of this project named `config`
- Within the `/config` directory a file named `config.env`

This file should look like the following

```
NODE_ENV=development
PORT=5000
CLIENT_ID=myid
CLIENT_SECRET=shh
REDIRECT_URI=http://localhost:5000/callback
```
