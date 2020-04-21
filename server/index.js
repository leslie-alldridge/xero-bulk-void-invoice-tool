const dotenv = require('dotenv');
const server = require('./server');

dotenv.config({ path: './config/config.env' });

const http = require('http');

let httpServer = http.createServer(server);

httpServer.setTimeout(10 * 60 * 1000); // 10 minute timeout for long running calls

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, function () {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
