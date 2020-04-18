import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  }
});

class SimpleModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.props.close}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="h6" id="modal-title">
              <b>How to use this application</b>
            </Typography>
            <Typography variant="subtitle1" id="simple-modal-description">
              1. Connect to your Xero organisation. <br />
              <br /> 2. Click Retrieve Invoices and then select which ones to
              void <br />
              <br />
              3. You can toggle receivables/payables and navigate through pages
              <br />
              <br />
              4. Press Void and Confirm the void <br />
              <br />
              Notes: If voiding more than the API limits allow, the app will
              wait for you and submit the rest of the invoices once the API
              limit has reset (60 seconds). <br />
              <br />
              Selected invoies will be reset everytime you navigate to a new
              page, this encourages a safe amount of voiding each time (100
              max). <br />
              <br />
              If the hyperlinks don't work, please ensure you're logged in to
              the right organisation in your web browser (open a new tab for
              Xero and login).
            </Typography>
            <SimpleModalWrapped />
          </div>
        </Modal>
      </div>
    );
  }
}

const SimpleModalWrapped = withStyles(styles)(SimpleModal);

export default SimpleModalWrapped;
