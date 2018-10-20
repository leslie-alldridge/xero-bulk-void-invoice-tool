import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import AutoRenew from '@material-ui/icons/Autorenew';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
});

function RetrieveButton(props) {
  const { classes } = props;
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={props.onClick}
      >
        Retrieve Invoices
        <Icon className={classes.rightIcon}>
          <AutoRenew />
        </Icon>
      </Button>
    </div>
  );
}

RetrieveButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RetrieveButton);
