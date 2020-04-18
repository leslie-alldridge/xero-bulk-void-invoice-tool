import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';

const { Content, Footer } = Layout;

export const Void = () => {
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">I am the void page</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Created by Leslie A. 2020</Footer>
    </Layout>
  );
};
