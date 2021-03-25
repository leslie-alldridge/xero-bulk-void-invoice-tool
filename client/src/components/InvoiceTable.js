import React, { Component } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import { Table, Button, DatePicker, notification } from 'antd';
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';

import { Error } from './common/Error';
import { remove } from '../utils/localstorage';

const { RangePicker } = DatePicker;

const columns = [
  {
    title: 'Invoice Number',
    dataIndex: 'invoiceNumber',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    render: (value) => {
      // convert date to human readable format
      return <Moment format='LL'>{value}</Moment>;
    },
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    render: (value) => {
      // convert date to human readable format
      return <Moment format='LL'>{value}</Moment>;
    },
  },
  {
    title: 'Contact',
    dataIndex: ['contact', 'name'],
  },
  {
    title: 'Total',
    dataIndex: 'total',
  },
  {
    title: 'Currency',
    dataIndex: 'currencyCode',
  },
];

class InvoiceTable extends Component {
  state = {
    selectedRowKeys: [],
    loading: false,
    invoiceData: [],
    invoiceMonth: [
      new Date().getFullYear() +
        '-' +
        ('0' + new Date().getMonth()).slice(-2) +
        '-' +
        ('0' + new Date().getDate()).slice(-2),
      new Date().getFullYear() +
        '-' +
        ('0' + (new Date().getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + new Date().getDate()).slice(-2),
    ],
    error: false,
    voidLoading: false,
    voidErrors: [],
    pagination: 100,
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
        remove('access_token');
      });
  };

  disconnect = () => {
    // removes users information from their cache
    remove('id_token');
    remove('oauth_expires_at');
    remove('access_token');
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      pagination,
    });
  };

  onDateChange = (date, dateString) => {
    // saves date dropdown changes to state
    this.setState({ invoiceMonth: dateString });
  };

  void = () => {
    // Send void api call to server with an array of invoice ids
    // This is less than ideal but we need to send the SDK our entire invoice object now, not just the invoiceID
    let res = this.state.invoiceData.filter((id, idx) =>
      this.state.selectedRowKeys.includes(this.state.invoiceData[idx].invoiceID)
    );
    this.setState({
      voidLoading: true,
      selectedRowKeys: res,
    });

    const api = axios.create({
      timeout: 10 * 60 * 1000, // extended API call duration to 10 minutes max for local development only
    });

    const interval = 1200; // prevents us from hitting Xero API rate limit 60 calls / min
    var promise = Promise.resolve();

    res.forEach((el, idx) => {
      promise = promise.then(() => {
        // Update state with progress information that'll be displayed to the user
        this.setState({
          msg: `Voiding ${idx + 1} out of ${res.length} invoices`,
        });
        // make the api call to void an invoice
        api
          .post('/void', { void: [el] })
          .then((data) => {
            if (data.data === 'Success') {
              console.log(`Voided ${el}`);
            } else {
              console.log(`Error voiding ${el}`);
              // Save errors to state but continue voiding
              this.setState({
                voidErrors: [...this.state.voidErrors, data.data.error],
              });
            }
          })
          .catch((exc) => {
            console.log(exc);
            this.setState({ voidLoading: false, error: true });
            remove('access_token');
          });

        return new Promise((resolve) => {
          setTimeout(resolve, interval);
        });
      });
    });

    promise.then(() => {
      // if we error, display error popup otherwise success pop up will show.
      this.state.voidErrors.length > 0
        ? notification.open({
            message: 'We encountered a problem',
            description: `Please see the error response for more information: InvoiceID: ${this.state.voidErrors.map(
              (item) => item
            )}`,
            icon: <FrownOutlined style={{ color: '#FF0000' }} />,
          })
        : notification.open({
            message: 'Invoices Voided Successfully',
            description: 'All invoices were voided without any issues.',
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
          });
      // clear out progress message and reset state
      this.setState({
        msg: null,
        voidLoading: false,
        selectedRowKeys: [],
        voidErrors: [],
      });
      // Update invoice list in the table
      setTimeout(() => {
        this.start();
      }, 500);
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
            type='primary'
            onClick={this.start}
            disabled={false}
            loading={loading}
          >
            Retrieve Invoices
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            danger
            type='secondary'
            onClick={() => {
              this.disconnect();
              window.location.reload();
            }}
            disabled={false}
          >
            Disconnect from Xero
          </Button>
          <RangePicker
            autoFocus={true}
            placeholder={this.state.invoiceMonth}
            style={{ marginLeft: 8 }}
            onChange={this.onDateChange}
          />
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
          {/* Void button only displays when invoices have been selected */}
          {hasSelected ? (
            <Button
              style={{ marginLeft: 8 }}
              danger
              type='primary'
              onClick={this.void}
              loading={voidLoading}
            >
              {/* Changes void button text to show user the voiding progress text */}
              {this.state.msg
                ? this.state.msg
                : `Void ${selectedRowKeys.length} items`}
            </Button>
          ) : null}
        </div>
        {/* When an error occurs, show user error page instead of table */}
        {this.state.error ? (
          <Error />
        ) : (
          <Table
            rowKey='invoiceID'
            rowSelection={rowSelection}
            columns={columns}
            dataSource={this.state.invoiceData}
            onChange={this.handleTableChange}
            pagination={this.state.pagination}
          />
        )}
      </div>
    );
  }
}

export default InvoiceTable;
