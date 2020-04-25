import React from 'react';
import { Alert } from 'antd';

const errMsg =
  'Please click below to reload the main page.\n' +
  "It's likely your API key expired or the connection to your organisation was lost.\n" +
  'We may have loaded old credentials so be sure to use the "Disconnect from Xero" button at the end of each session.';

export const Error = () => (
  <div>
    <Alert
      message="We encountered an error!"
      description={errMsg}
      type="error"
    />
    <a href="/">Back home</a>
  </div>
);
