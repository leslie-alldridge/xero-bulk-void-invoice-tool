import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { PageFooter } from './PageFooter';

const { Content } = Layout;

export const NotFound = () => {
  return (
    <Layout className='layout'>
      <Content style={{ padding: '0 50px' }}>
        <div className='site-layout-content'>
          <strong>404 - Not Found</strong>
          <br />
          <img alt='404 page robot' height='100px' src='/robot.png' />
          <h2>It looks like we've lost you...</h2>
          <p>
            Please click <Link to='/'>here</Link> to go back to the application.
          </p>
        </div>
      </Content>
      <PageFooter />
    </Layout>
  );
};
