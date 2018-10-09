import React from 'react';
import request from 'superagent';
import PropTypes from 'prop-types';
import Loading from './Loading';
import SwitchToggle from './Switch';
import XeroButton from './SendButton';
//Material UI imports
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
});

class SimpleTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      invoices: [],
      type: 'ACCREC',
      loading: false,
      checkedA: true,
      selected: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
    const rows = this.state.invoices.length;
  }

  handleClick() {
    this.setState({
      loading: true
    });
    request.get('/invoices').then(res => {
      this.setState({
        loading: false,
        invoices: res.body.Invoices
      });
    });
  }

  handleToggle(name, e) {
    this.setState({
      type: this.state.type == 'ACCREC' ? 'ACCPAY' : 'ACCREC',
      checkedA: !this.state.checkedA,
      rows: this.state.invoices
        .filter(
          invoice =>
            invoice.Type !== this.state.type &&
            invoice.InvoiceNumber !== 'Expense Claims'
        )
        .map(invoice => invoice)
    });
    console.log(this.state);
  }

  handleSelectAllClick(event) {
    console.log(event.target.checked);

    if (event.target.checked) {
      this.setState({ selected: this.state.invoices.map(n => n.InvoiceID) });
      return;
    }
    this.setState({ selected: [] });
  }

  render() {
    const { classes } = this.props;
    const numSelected = this.state.selected.length;
    const rowCount = this.state.rows.length;
    return (
      <div>
        {!this.state.loading && (
          <p>
            You're now viewing:{' '}
            {this.state.type == 'ACCREC'
              ? 'Accounts Receivable'
              : 'Accounts Payable'}
          </p>
        )}

        <Paper className={classes.root}>
          {!this.state.loading && (
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={numSelected > 0 && numSelected < rowCount}
                      // checked={numSelected === rowCount}
                      onChange={this.handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell numeric>Invoice Number</TableCell>
                  <TableCell numeric>Date</TableCell>
                  <TableCell numeric>Due Date</TableCell>
                  <TableCell numeric>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.invoices.map(invoice => {
                  console.log(invoice);
                  if (
                    invoice.InvoiceNumber !== 'Expense Claims' &&
                    this.state.type == invoice.Type
                  ) {
                    return (
                      <TableRow key={invoice.InvoiceID}>
                        <TableCell padding="checkbox">
                          <Checkbox />
                        </TableCell>
                        <TableCell numeric>
                          <a
                            href={`https://go.xero.com/AccountsReceivable/View.aspx?InvoiceID=${
                              invoice.InvoiceID
                            }`}
                            target="_blank"
                          >
                            {invoice.InvoiceNumber}
                          </a>
                        </TableCell>
                        <TableCell numeric>{invoice.DateString}</TableCell>
                        <TableCell numeric>{invoice.DueDateString}</TableCell>
                        <TableCell numeric>{invoice.Total}</TableCell>
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          )}
          {this.state.loading && <Loading />}

          <XeroButton />

          <button onClick={this.handleClick}>Click me pls</button>
          <SwitchToggle
            checked={this.state.checkedA}
            toggle={this.handleToggle}
          />
        </Paper>
      </div>
    );
  }
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTable);
