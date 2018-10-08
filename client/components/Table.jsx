import React from 'react';
import request from 'superagent';
import PropTypes from 'prop-types';
import Loading from './Loading';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SwitchToggle from './Switch';

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
      checkedA: true
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
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
      checkedA: !this.state.checkedA
    });
    console.log(this.state);
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        {!this.state.loading && (
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Void?</TableCell>
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
                      <TableCell component="th" scope="row" />
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
        <a href="/connect">Connect to Xero</a>
        <button onClick={this.handleClick}>Click me pls</button>
        <SwitchToggle
          checked={this.state.checkedA}
          toggle={this.handleToggle}
        />
      </Paper>
    );
  }
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTable);
