import React from 'react';
import request from '../utils/api';
import PropTypes from 'prop-types';

import Loading from './Loading';
import SwitchToggle from './Buttons/Switch';
import XeroButton from './Buttons/Send';
import RetrieveButton from './Buttons/Retrieve';
import VoidButton from './Buttons/Void';
import VoidConfirm from './Buttons/VoidConfirm';
import Notification from './Snackbar';
import ErrSnackbar from './ErrSnackbar';
import SimpleModalWrapped from './Modal';

import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Paper from '@material-ui/core/Paper';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';

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

class InvoiceTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rows: [],
      invoices: [],
      type: 'ACCREC',
      loading: false,
      apiLimit: false,
      error: false,
      checkedA: true,
      selected: [],
      voidConfirm: false,
      snackbar: false,
      page: 1,
      open: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
    this.boxChange = this.boxChange.bind(this);
    this.handleVoid = this.handleVoid.bind(this);
    this.voidConfirmed = this.voidConfirmed.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangePageBack = this.handleChangePageBack.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  handleClick() {
    this.setState({
      loading: true
    });
    request('get', `/invoices/${this.state.page}`)
      .then(res => {
        this.setState({
          error: false,
          loading: false,
          invoices: res.body.Invoices,
          checkedA: !this.state.checkedA,
          rows: res.body.Invoices.filter(
            invoice =>
              invoice.Type !== 'ACCPAY' &&
              invoice.InvoiceNumber !== 'Expense Claims'
          )
        });
      })
      .catch(err => {
        this.setState({
          error: true,
          loading: false
        });
      });
  }

  handleChangePage() {
    this.setState({
      loading: true,
      page: this.state.page + 1
    });
    request('get', `/invoices/${this.state.page + 1}`)
      .then(res => {
        this.setState({
          error: false,
          loading: false,
          voidConfirm: false,
          invoices: res.body.Invoices,
          checkedA: !this.state.checkedA,
          rows: res.body.Invoices.filter(
            invoice =>
              invoice.Type !== 'ACCPAY' &&
              invoice.InvoiceNumber !== 'Expense Claims'
          )
        });
      })
      .catch(err => {
        this.setState({
          error: true,
          loading: false
        });
      });
  }

  handleChangePageBack() {
    this.setState({
      loading: true,
      page: this.state.page - 1
    });
    request('get', `/invoices/${this.state.page - 1}`)
      .then(res => {
        this.setState({
          error: false,
          loading: false,
          invoices: res.body.Invoices,
          checkedA: !this.state.checkedA,
          voidConfirm: false,
          rows: res.body.Invoices.filter(
            invoice =>
              invoice.Type !== 'ACCPAY' &&
              invoice.InvoiceNumber !== 'Expense Claims'
          )
        });
      })
      .catch(err => {
        this.setState({
          error: true,
          loading: false
        });
      });
  }

  handleToggle(name, e) {
    this.setState({
      type: this.state.type == 'ACCREC' ? 'ACCPAY' : 'ACCREC',
      checkedA: !this.state.checkedA,
      rows: this.state.invoices.filter(
        invoice =>
          invoice.Type !== this.state.type &&
          invoice.InvoiceNumber !== 'Expense Claims'
      ),
      selected: []
    });
  }

  handleSelectAllClick(event) {
    if (event.target.checked == true) {
      this.setState({
        selected: this.state.rows.map(inv => inv.InvoiceID)
      });
    } else {
      return this.setState({
        selected: []
      });
    }
  }

  boxChange(inv) {
    this.state.selected.includes(inv)
      ? this.setState({
          selected: this.state.selected.filter(invoice => invoice !== inv)
        })
      : this.setState({
          selected: this.state.selected.concat(inv)
        });
  }

  handleVoid() {
    this.setState({
      voidConfirm: true
    });
  }

  voidConfirmed() {
    let obj = { void: this.state.selected };
    if (this.state.selected.length > 50) {
      this.setState({ loading: true });
      let obj = { void: [] };
      for (let i = 0; i < 50; i++) {
        obj.void.push(this.state.selected[i]);
      }
      request('post', '/void', obj)
        .then(res => {
          this.setState({ apiLimit: true });
          setTimeout(() => {
            let obj = { void: [] };
            for (let i = 50; i < this.state.selected.length; i++) {
              obj.void.push(this.state.selected[i]);
            }
            request('post', '/void', obj)
              .then(res => {})
              .catch(err => {});
            this.setState({
              page: 0,
              rows: [],
              invoices: [],
              type: 'ACCREC',
              loading: false,
              apiLimit: false,
              error: false,
              checkedA: true,
              selected: [],
              voidConfirm: false,
              snackbar: false,
              page: 1
            });
            setTimeout(() => {
              this.handleClick();
            }, 150);
            this.setState({
              apiLimit: false
            });
          }, 65000);
        })
        .catch(err => {
          this.setState({
            error: true,
            loading: false
          });
        });
    } else {
      request('post', '/void', obj)
        .then(res => {
          this.setState({
            page: 0,
            rows: [],
            invoices: [],
            type: 'ACCREC',
            loading: false,
            apiLimit: false,
            error: false,
            checkedA: true,
            selected: [],
            voidConfirm: false,
            snackbar: false,
            page: 1
          });
          setTimeout(() => {
            this.handleClick();
          }, 350);
          this.setState({
            error: false,
            snackbar: true
          });
        })
        .catch(err => {
          this.setState({
            error: true
          });
        });
    }
  }

  handleClose() {
    this.setState({
      snackbar: false,
      error: false
    });
  }

  openModal() {
    this.setState({
      open: true
    });
  }

  closeModal() {
    this.setState({
      open: false
    });
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
            {this.state.type == 'ACCREC' ? (
              <b>
                Accounts Receivable -{' '}
                {this.state.page > 1 && (
                  <ArrowBackIos
                    style={{
                      color: '#3f51b5',
                      marginTop: '10px',
                      paddingTop: '10px'
                    }}
                    onClick={this.handleChangePageBack}
                  />
                )}
                Page {this.state.page}{' '}
                {rowCount >= 100 && (
                  <ArrowForwardIos
                    style={{
                      color: '#3f51b5',
                      marginTop: '10px',
                      paddingTop: '10px'
                    }}
                    onClick={this.handleChangePage}
                  />
                )}
              </b>
            ) : (
              <b>
                Accounts Payable -
                {this.state.page > 1 && (
                  <ArrowBackIos
                    style={{
                      color: '#3f51b5',
                      marginTop: '10px',
                      paddingTop: '10px'
                    }}
                  />
                )}{' '}
                Page {this.state.page}{' '}
                <ArrowForwardIos
                  style={{
                    color: '#3f51b5',
                    marginTop: '10px',
                    paddingTop: '10px'
                  }}
                  onClick={this.handleChangePage}
                />
              </b>
            )}
          </p>
        )}
        {this.state.apiLimit &&
          'Xero API Limit reached, please wait sixty seconds for it to reset'}
        <Paper className={classes.root}>
          {!this.state.loading && (
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={numSelected > 0 && numSelected < rowCount}
                      onChange={this.handleSelectAllClick}
                      checked={
                        this.state.selected.length > 0 &&
                        this.state.selected.length == rowCount
                      }
                    />
                  </TableCell>
                  {this.state.type == 'ACCREC' && (
                    <TableCell numeric>Invoice Number</TableCell>
                  )}
                  {this.state.type == 'ACCPAY' && (
                    <TableCell numeric>Bill Reference</TableCell>
                  )}
                  <TableCell numeric>Date</TableCell>
                  <TableCell numeric>Due Date</TableCell>
                  <TableCell numeric>Contact</TableCell>
                  <TableCell numeric>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.invoices.map(invoice => {
                  if (
                    invoice.InvoiceNumber !== 'Expense Claims' &&
                    this.state.type == invoice.Type
                  ) {
                    return (
                      <TableRow key={invoice.InvoiceID}>
                        <TableCell
                          onChange={() => {
                            this.boxChange(invoice.InvoiceID);
                          }}
                          padding="checkbox"
                        >
                          <Checkbox
                            checked={this.state.selected.includes(
                              invoice.InvoiceID
                            )}
                          />
                        </TableCell>
                        <TableCell numeric>
                          {this.state.type == 'ACCREC' && (
                            <a
                              href={`https://go.xero.com/AccountsReceivable/View.aspx?invoiceid=${
                                invoice.InvoiceID
                              }`}
                              target="_blank"
                            >
                              {invoice.InvoiceNumber}
                            </a>
                          )}
                          {this.state.type == 'ACCPAY' && (
                            <a
                              href={`https://go.xero.com/AccountsPayable/View.aspx?invoiceid=${
                                invoice.InvoiceID
                              }`}
                              target="_blank"
                            >
                              {invoice.InvoiceNumber || 'No reference'}
                            </a>
                          )}
                        </TableCell>
                        <TableCell numeric>
                          {invoice.DateString.slice(0, 10)}
                        </TableCell>
                        <TableCell numeric>
                          {invoice.DueDateString.slice(0, 10)}
                        </TableCell>
                        <TableCell numeric>
                          {String(invoice.Contact.Name).length > 10
                            ? String(invoice.Contact.Name).substring(0, 10) +
                              '...'
                            : invoice.Contact.Name}
                        </TableCell>
                        <TableCell numeric>${invoice.Total}</TableCell>
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          )}
          {this.state.loading && <Loading />}
          <div id="buttons">
            <XeroButton />
            <RetrieveButton onClick={this.handleClick} />
            {!this.state.voidConfirm && (
              <VoidButton onClick={this.handleVoid} />
            )}
            {this.state.voidConfirm && (
              <VoidConfirm onClick={this.voidConfirmed} />
            )}
          </div>
          <SwitchToggle
            checked={this.state.checkedA}
            toggle={this.handleToggle}
          />
          <Notification
            handleClose={this.handleClose}
            open={this.state.snackbar}
          />
        </Paper>
        <p style={{ color: '#3f51b5' }} onClick={this.openModal}>
          Need help? Click here
        </p>
        {this.state.open && (
          <SimpleModalWrapped open={this.state.open} close={this.closeModal} />
        )}
        {this.state.error && (
          <ErrSnackbar handleClose={this.handleClose} open={this.state.error} />
        )}
      </div>
    );
  }
}

InvoiceTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InvoiceTable);
