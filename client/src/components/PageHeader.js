import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

export const PageHeader = (props) => {
  const currentPath = props.currentPath;
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[currentPath]}
        >
          <Menu.Item key="/void">
            <Link to="/void">Void Invoices</Link>
          </Menu.Item>
          <Menu.Item key="/about">
            <Link to="/about">About</Link>
          </Menu.Item>
          <Menu.Item key="/help">
            <Link to="/help">Help</Link>
          </Menu.Item>
        </Menu>
      </Header>
      {/* <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">Content</div>
      </Content> */}
      {/* <Footer style={{ textAlign: 'center' }}>Created by Leslie A. 2020</Footer> */}
    </Layout>
  );
};
