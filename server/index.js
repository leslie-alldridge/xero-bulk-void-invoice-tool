import app from './server.js';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config({ path: './config/.env' });

let httpServer = http.createServer(app);

httpServer.setTimeout(10 * 60 * 1000); // 10 minute timeout for long running calls

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, function () {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
