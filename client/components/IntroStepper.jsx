import React from 'react';
import PropTypes from 'prop-types';

import Table from './Table';
import { get, set } from '../utils/localstorage';

import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing.unit * 8,
    padding: `${theme.spacing.unit * 6}px 0`,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  },
  backButton: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    alignContent: 'center',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});

function getSteps() {
  return [
    'Press "Connect to Xero" and then click "Retrieve Invoices"',
    'Check invoices you wish to void',
    'Press void'
  ];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'The first button will authenticate access to your organisation, the second button returns a page of invoices (100 per page max)';
    case 1:
      return 'You can use the checkbox to select invoices to void and browse multiple pages';
    case 2:
      return 'Press Void and confirm the results in your Xero organisation';
    default:
      return 'Sorry we lost you, please reload the page';
  }
}

class IntroStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      showTable: JSON.parse(get('steps'))
    };
    this.handleBack = this.handleBack.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  handleNext() {
    if (this.state.activeStep == 2) {
      this.setState({
        showTable: true
      });
      set('steps', true);
    }

    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
  }

  handleBack() {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  }

  handleReset() {
    this.setState({
      activeStep: 0
    });
  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        {this.state.showTable == true ? (
          <Table />
        ) : (
          <div>
            <Typography
              className={classes.content}
              variant="title"
              align="center"
              gutterBottom
            >
              Instructions:
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map(label => {
                return (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <div className={classes.instructions}>
              {this.state.activeStep === steps.length ? (
                <div align="center">
                  <Typography className={classes.instructions}>
                    Press Reset to read again
                  </Typography>
                  <Button onClick={this.handleReset}>Reset</Button>
                </div>
              ) : (
                <div>
                  <Typography align="center" className={classes.instructions}>
                    {getStepContent(activeStep)}
                  </Typography>
                  <div align="center">
                    <Button
                      align="center"
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.backButton}
                    >
                      Back
                    </Button>
                    <Button
                      align="center"
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext}
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

IntroStepper.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(IntroStepper);
