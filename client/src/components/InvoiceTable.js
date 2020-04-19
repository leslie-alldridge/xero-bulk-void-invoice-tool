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
    invoiceMonth: '2020-01',
    error: false,
  };

  start = () => {
    this.setState({ loading: true });
    // retrives invoices for the user
    axios
      .get(`/invoices?date=${this.state.invoiceMonth}`)
      .then((data) => {
        console.log(data.data);
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
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  onDateChange = (date, dateString) => {
    // saves date dropdown changes to state
    this.setState({ invoiceMonth: dateString });
  };

  void = () => {
    this.state.selectedRowKeys.map((item) =>
      console.log(`We will void: ${item}`)
    );
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
