import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
  colorSwitchBase: {
    color: indigo[300],
    '&$colorChecked': {
      color: indigo[500],
      '& + $colorBar': {
        backgroundColor: indigo[500]
      }
    }
  },
  colorBar: {},
  colorChecked: {},

  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
    easing: theme.transitions.easing.sharp
  })
});

class SwitchToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedA: true
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={this.props.checked}
              onChange={e => {
                this.props.toggle('checkedA', e);
              }}
              value="checkedA"
              classes={{
                switchBase: classes.colorSwitchBase,
                checked: classes.colorChecked,
                bar: classes.colorBar
              }}
            />
          }
          label="Toggle Receivables/Payables"
        />
      </FormGroup>
    );
  }
}

SwitchToggle.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SwitchToggle);
