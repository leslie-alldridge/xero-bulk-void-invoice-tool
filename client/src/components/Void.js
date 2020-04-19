import React from 'react';
import axios from 'axios';
import { Layout } from 'antd';

import { get } from '../utils/localstorage';
import InvoiceTable from './InvoiceTable';

const { Content, Footer } = Layout;

export const Void = () => {
  const hasAuth = get('oauth_token_secret');
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          {/* If user is not authenticated, show button, otherwise let them know they're authenticated. */}
          {hasAuth === null ? (
            <div>
              <h3>Please click below to connect with your Xero organisation</h3>

              <span
                onClick={() =>
                  axios
                    .get('/connect')
                    .then((data) => window.location.assign(data.data))
                }
              >
                <img
                  style={{
                    width: '180px',
                    borderRadius: '7px',
                    cursor: 'pointer',
                  }}
                  src="./signin.PNG"
                  alt="sign in logo"
                ></img>
              </span>
            </div>
          ) : (
            <div>
              <p>Authenticated</p>
              <InvoiceTable />
            </div>
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Created by Leslie A. 2020</Footer>
    </Layout>
  );
};
