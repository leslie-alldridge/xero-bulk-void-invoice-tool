The Project in this directory is the backend Node server for the Xero Bulk Void Invoice Tool

- index.js imports the server config with routes and listens on the desired port. Timeout is set to 10 minutes which isn't great, but a simple win for handling long running http requests whilst avoiding Xero's rate limit.
