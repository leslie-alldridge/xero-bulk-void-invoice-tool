import React from 'react';
import { Layout } from 'antd';
import { PageFooter } from './common/PageFooter';

const { Content } = Layout;

export const Help = () => {
  return (
    <Layout className='layout'>
      <Content style={{ padding: '0 50px' }}>
        <div className='site-layout-content'>
          <p>
            I've outlined all the the information you'll need in the GitHub
            readme file. If you feel that something is missing, please reach out
            to me on GitHub or via{' '}
            <a href='mailto: leslie.alldridge@gmail.com'>Email </a>
            and I'll do my best to help or point you in the right direction.
          </p>
          <p>
            Please note: There are API limits set by Xero and you may be
            impacted by these. Limits are per tenant (organisation) and you can
            view them{' '}
            <a href='https://developer.xero.com/documentation/oauth2/limits'>
              here
            </a>
            .
          </p>
          <p>
            I once had someone wishing to void 10,000 invoices and we discovered
            the 5,000 calls per day limit. So they had to do 5,000 one day and
            another 5,000 the following.
          </p>
          <p>
            As these limits are set by Xero I'm unable to do anything other than
            editing my code to comply. Thanks for understanding.
          </p>
        </div>
      </Content>
      <PageFooter />
    </Layout>
  );
};
