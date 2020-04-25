import React from 'react';
import { Layout } from 'antd';
import { PageFooter } from './common/PageFooter';

const { Content } = Layout;

export const About = () => {
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">I am the about page</div>
      </Content>
      <PageFooter />
    </Layout>
  );
};
