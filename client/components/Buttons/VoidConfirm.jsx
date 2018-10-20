import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import DeleteForever from '@material-ui/icons/DeleteForever';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
});

function VoidConfirm(props) {
  const { classes } = props;
  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        onClick={props.onClick}
      >
        Confirm Void
        <Icon className={classes.rightIcon}>
          <DeleteForever />
        </Icon>
      </Button>
    </div>
  );
}

VoidConfirm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VoidConfirm);
