import React from 'react';
import { Layout } from 'antd';
import { PageFooter } from './common/PageFooter';

const { Content } = Layout;

export const Help = () => {
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <p>I'm the help page</p>
        </div>
      </Content>
      <PageFooter />
    </Layout>
  );
};
