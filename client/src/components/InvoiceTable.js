import React from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import { Table, Button, DatePicker } from 'antd';

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
    error: false,
  };

  start = () => {
    this.setState({ loading: true });
    // retrives invoices for the user
    axios
      .get('/invoices')
      .then((data) => {
        console.log(data.data.Invoices);
        this.setState({ loading: false, invoiceData: data.data.Invoices });
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
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  onDateChange = (date, dateString) => {
    console.log(date, dateString);
  };

  render() {
    const { loading, selectedRowKeys } = this.state;
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
            style={{ marginLeft: 8 }}
            onChange={this.onDateChange}
            picker="month"
          />
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        {/* When an error occurs, show user error page instead of table */}
        {this.state.error ? (
          <Error />
        ) : (
          <Table
            rowKey="InvoiceNumber"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={this.state.invoiceData}
          />
        )}
      </div>
    );
  }
}

export default InvoiceTable;
