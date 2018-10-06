import React from 'react';
import request from 'superagent';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

class SimpleTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      invoices: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    request.get('/invoices').then(res => {
      this.setState({
        invoices: res.body.Invoices
      });
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
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

              return (
                <TableRow key={invoice.InvoiceID}>
                  <TableCell component="th" scope="row">
                    {invoice.InvoiceNumber}
                  </TableCell>
                  <TableCell numeric>{invoice.Date}</TableCell>
                  {/* <TableCell numeric>{row.fat}</TableCell>
                  <TableCell numeric>{row.carbs}</TableCell>
                  <TableCell numeric>{row.protein}</TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <a href="/connect">Connect to Xero</a>
        <button onClick={this.handleClick}>Click me pls</button>
      </Paper>
    );
  }
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTable);
