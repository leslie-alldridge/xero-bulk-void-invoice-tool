import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Send from '@material-ui/icons/Send';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
});

function XeroButton(props) {
  const { classes } = props;
  return (
    <div>
      <Button
        href="/connect"
        variant="contained"
        color="primary"
        className={classes.button}
      >
        Connect to Xero
        <Icon className={classes.rightIcon}>
          <Send />
        </Icon>
      </Button>
    </div>
  );
}

XeroButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(XeroButton);
