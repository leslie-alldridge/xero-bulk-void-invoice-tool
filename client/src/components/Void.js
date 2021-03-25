import React from 'react';
import { Layout } from 'antd';
import { get } from '../utils/localstorage';
import InvoiceTable from './InvoiceTable';
import { PageFooter } from './common/PageFooter';

const { Content } = Layout;

export const Void = () => {
  const hasAuth = get('access_token');
  return (
    <Layout className='layout'>
      <Content style={{ padding: '0 50px' }}>
        <div className='site-layout-content'>
          {/* If user is not authenticated, show button, otherwise let them know they're authenticated. */}
          {hasAuth === null ? (
            <div>
              <h3>Please click below to connect with your Xero organisation</h3>
              <span data-xero-sso data-label='Sign in with Xero'></span>
            </div>
          ) : (
            <div>
              <p>
                Credentials found. If you need to halt an invoice voiding job,
                please refresh the entire page using Ctrl + R or F5
              </p>
              <InvoiceTable />
            </div>
          )}
        </div>
      </Content>
      <PageFooter />
    </Layout>
  );
};
