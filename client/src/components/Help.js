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
        </div>
      </Content>
      <PageFooter />
    </Layout>
  );
};
