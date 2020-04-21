const dotenv = require('dotenv');
const server = require('./server');

dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT || 5000;

// var express = require('express');
var http = require('http');

// var app = module.exports.app = express();
var httpServer = http.createServer(server);
httpServer.setTimeout(10 * 60 * 1000); // 10 * 60 seconds * 1000 msecs
httpServer.listen(PORT, function () {
  console.log('**** STARTING SERVER ****' + PORT);
});

// Start server using our environment variables
// server.listen(
//   PORT,
//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
// );
