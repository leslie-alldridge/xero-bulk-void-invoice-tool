import React from 'react';
import { Layout } from 'antd';
import { PageFooter } from './common/PageFooter';

const { Content } = Layout;

export const About = () => {
  return (
    <Layout className='layout'>
      <Content style={{ padding: '0 50px' }}>
        <div className='site-layout-content'>
          <p>
            During my time at Enspiral Dev Academy (a coding bootcamp) I wanted
            to solve real life problems instead of making yet another To-Do list
            app. I decided to look up feature requests for Xero and landed on
            the inability to bulk void invoices. Using their API and a few loops
            of code, I figured this would be a great problem to solve.{' '}
          </p>
          <p>
            Therefore, this application is made to help or inspire others
            looking to solve the same problem. You can use it to bulk void too.
            I feel that this is definitely a gap in the current software that
            Xero will fill eventually, so I haven't bothered to dress this up
            super nice and advertise it to the wider Xero community. Once the
            feature is released (whenever that'll be), this application won't be
            of any use to anybody.
          </p>
          <p>
            I do update this app from time to time as quite a few folks are
            using it. The first release was back in 2018 and the coding bootcamp
            was a great success as I'm currently in a full time Developer role.
          </p>
          <p>
            So in short, I made this to solve a real life problem whilst
            learning how to code.
          </p>
        </div>
      </Content>
      <PageFooter />
    </Layout>
  );
};
