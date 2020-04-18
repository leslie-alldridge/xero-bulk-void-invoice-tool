import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Delete from '@material-ui/icons/Delete';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
});

function VoidButton(props) {
  const { classes } = props;
  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        onClick={props.onClick}
      >
        Void Invoices
        <Icon className={classes.rightIcon}>
          <Delete />
        </Icon>
      </Button>
    </div>
  );
}

VoidButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VoidButton);
