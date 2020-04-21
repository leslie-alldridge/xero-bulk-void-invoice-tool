import React from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import { Table, Button, DatePicker, notification } from 'antd';
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';

import { Error } from './Error';
import { remove } from '../utils/localstorage';

const columns = [
  {
    title: 'Invoice Number',
    dataIndex: 'InvoiceNumber',
  },
  {
    title: 'Date',
    dataIndex: 'DateString',
    render: (value) => {
      // convert date to human readable format
      return <Moment format="LL">{value}</Moment>;
    },
  },
  {
    title: 'Due Date',
    dataIndex: 'DueDateString',
    render: (value) => {
      // convert date to human readable format
      return <Moment format="LL">{value}</Moment>;
    },
  },
  {
    title: 'Contact',
    dataIndex: ['Contact', 'Name'],
  },
  {
    title: 'Total',
    dataIndex: 'Total',
  },
  {
    title: 'Currency',
    dataIndex: 'CurrencyCode',
  },
];

class InvoiceTable extends React.Component {
  state = {
    selectedRowKeys: [],
    loading: false,
    invoiceData: [],
    invoiceMonth: '2020-01',
    error: false,
    voidLoading: false,
  };

  start = () => {
    this.setState({ loading: true });
    // retrieves invoices for the user
    axios
      .get(`/invoices?date=${this.state.invoiceMonth}`)
      .then((data) => {
        this.setState({ loading: false, invoiceData: data.data });
      })
      .catch((exc) => {
        this.setState({ loading: false, error: true });
        remove('oauth_token_secret');
      });
  };

  disconnect = () => {
    // removes users information from their cache
    remove('oauth_token');
    remove('oauth_expires_at');
    remove('oauth_token_secret');
  };

  onSelectChange = (selectedRowKeys) => {
    // fires when user selects a row in the table
    this.setState({ selectedRowKeys });
  };

  onDateChange = (date, dateString) => {
    // saves date dropdown changes to state
    this.setState({ invoiceMonth: dateString });
  };

  void = () => {
    // Send void api call to server with an array of invoice ids
    this.setState({ voidLoading: true });

    const api = axios.create({
      timeout: 10 * 60 * 1000, // extended API call duration to 10 minutes max
    });

    api
      .post('/void', { void: this.state.selectedRowKeys })
      .then((data) => {
        if (data.data === 'Success') {
          this.setState({ voidLoading: false, selectedRowKeys: [] });
          // Success pop up message
          notification.open({
            message: 'Invoices Voided Successfully',
            description: 'All invoices were voided without any issues.',
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
          });
        } else {
          this.setState({ voidLoading: false, selectedRowKeys: [] });
          // Error pop up message
          notification.open({
            message: 'We encountered a problem',
            description: `Please see the error response for more information: InvoiceID: ${data.data.error}`,
            icon: <FrownOutlined style={{ color: '#FF0000' }} />,
          });
        }
      })
      .catch((exc) => {
        this.setState({ voidLoading: false, error: true });
        remove('oauth_token_secret');
      });
  };

  render() {
    const { loading, voidLoading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={this.start}
            disabled={false}
            loading={loading}
          >
            Retrieve Invoices
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            danger
            type="secondary"
            onClick={() => {
              this.disconnect();
              window.location.reload();
            }}
            disabled={false}
          >
            Disconnect from Xero
          </Button>
          <DatePicker
            autoFocus={true}
            placeholder={'2020-01'}
            style={{ marginLeft: 8 }}
            onChange={this.onDateChange}
            picker="month"
          />
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
          {/* Void button only displays when invoices have been selected */}
          {hasSelected ? (
            <Button
              style={{ marginLeft: 8 }}
              danger
              type="primary"
              onClick={this.void}
              loading={voidLoading}
            >
              {`Void ${selectedRowKeys.length} items`}
            </Button>
          ) : null}
        </div>
        {/* When an error occurs, show user error page instead of table */}
        {this.state.error ? (
          <Error />
        ) : (
          <Table
            rowKey="InvoiceID"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={this.state.invoiceData}
            pagination={{ pageSize: 100 }}
          />
        )}
      </div>
    );
  }
}

export default InvoiceTable;
