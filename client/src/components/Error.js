import React from 'react';
import { Alert, Button } from 'antd';

export const Error = () => (
  <div>
    <Alert
      message="We encountered an error!"
      description="Please click below to reload the main page. It's likely your API key expired or the connection to your organisation was lost."
      type="error"
    />
    <a href="/">Back home</a>
  </div>
);
