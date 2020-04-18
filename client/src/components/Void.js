import React from 'react';
import axios from 'axios';
import { Layout, Menu, Breadcrumb } from 'antd';

const { Content, Footer } = Layout;

export const Void = () => {
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <h3>Please click below to connect with your Xero organisation</h3>
          <span
            onClick={() => axios.get('/connect')}
            data-xero-sso
            data-theme="dark"
            data-href="#"
            data-label="Sign in with Xero"
          ></span>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Created by Leslie A. 2020</Footer>
    </Layout>
  );
};
