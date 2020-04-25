### Local environment

To run this application locally you'll need the following

- A directory within the root of this project named `config`
- Within the `/config` directory a file named `config.env`

This file should look like the following

```
NODE_ENV=development
PORT=5000
consumerKey=yourconsumerkey
consumerSecret=yourconsumersecret
callbackDomainTest=http://localhost:3000
callbackDomainUat=https://herokuurl.herokuapp.com
callbackDomainProd=https://herokuurl2.herokuapp.com
```
