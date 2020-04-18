const dotenv = require('dotenv');
const server = require('./server');

dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT || 5000;

// Start server using our environment variables
server.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
