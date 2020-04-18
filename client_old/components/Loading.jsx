import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import indigo from '@material-ui/core/colors/indigo';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  }
});

function CircularIndeterminate(props) {
  const { classes } = props;
  return (
    <div>
      <CircularProgress
        className={classes.progress}
        style={{ color: indigo[500] }}
        thickness={7}
      />
    </div>
  );
}

CircularIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CircularIndeterminate);
