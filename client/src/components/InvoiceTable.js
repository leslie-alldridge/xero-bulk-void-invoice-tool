import React from 'react';
import axios from 'axios';
import { Table, Button } from 'antd';

const columns = [
  {
    title: 'Invoice Number',
    dataIndex: 'invoicenumber',
  },
  {
    title: 'Date',
    dataIndex: 'date',
  },
  {
    title: 'Due Date',
    dataIndex: 'duedate',
  },
  {
    title: 'Contact',
    dataIndex: 'contact',
  },
  {
    title: 'Total',
    dataIndex: 'total',
  },
];

const data = [];

class InvoiceTable extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  };

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    axios.get('/invoices').then((data) => console.log(data.data));
  };

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
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
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
        />
      </div>
    );
  }
}

export default InvoiceTable;
