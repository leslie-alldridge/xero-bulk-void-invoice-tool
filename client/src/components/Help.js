import React from 'react';
import { Layout } from 'antd';

const { Content, Footer } = Layout;

export const Help = () => {
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <p>I'm the help page</p>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>Created by Leslie A. 2020</Footer>
    </Layout>
  );
};
