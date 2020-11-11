import React from 'react';
import axios from 'axios';
import { Spin, Layout } from 'antd';

import { PageFooter } from './common/PageFooter';
import { set } from '../utils/localstorage';

const { Content } = Layout;

export const Auth = (props) => {
  const search = props.search;
  axios.get(`/token`).then((data) => {
    // Save users information to localstorage
    set('oauth_expires_at', data.data.expires_at);
    set('access_token', data.data.access_token);
    set('id_token', data.data.id_token);
    props.history.push('/');
  });
  return (
    <Layout className='layout'>
      <Content style={{ padding: '0 50px' }}>
        <div className='site-layout-content'>
          <Spin tip='Authenticating...'></Spin>
        </div>
      </Content>
      <PageFooter />
    </Layout>
  );
};
