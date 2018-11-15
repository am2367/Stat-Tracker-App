import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Modal from '@material-ui/core/Modal';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Question from './Question.js';
import NotificationDetails from './NotificationDetails.js';

const styles = theme => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  }
});

function getSteps() {
    return ['Configure Question', 'Notication Settings'];
}
  
function getStepContent(step) {
switch (step) {
    case 0:
    return 'Configure Your Question Content and Response Scale';
    case 1:
    return 'Set Your Notification Preferences';
    default:
    return 'Unknown step';
}
}

class ConfigModal extends React.Component {
  state={configName: this.props.configName,
         activeStep: 0,
         numQuestions: 1,
         completed: {},
         validateForm: false,
         questionConfigError: false,
         notificationConfigError: false,
         triggerAnswerType: ''}

  handleClose = () => {
    this.props.onClose();
  };

  componentDidMount = () => {
    this.addQuestion('');
  }

  componentWillReceiveProps = (nextProps) => {
      this.setState({configName: nextProps.configName})
  }

  totalSteps = () => {
    return getSteps().length;
  };

  handleNext = () => {
    let activeStep;

    if (this.isLastStep() && !this.allStepsCompleted()) {
      // It's the last step, but not all steps have been completed,
      // find the first step that has been completed
      const steps = getSteps();
      activeStep = steps.findIndex((step, i) => !(i in this.state.completed));
    } else {
      activeStep = this.state.activeStep + 1;
    }
    this.setState({
      activeStep,
    });
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleStep = step => () => {
    this.setState({
      activeStep: step,
    });
  };

  handleComplete = () => {
    const { completed } = this.state;
    completed[this.state.activeStep] = true;
    this.setState({
      completed,
    });
    this.handleNext();
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
      completed: {},
      questionList: []
    });
  };

  completedSteps() {
    return Object.keys(this.state.completed).length;
  }

  isLastStep() {
    return this.state.activeStep === this.totalSteps() - 1;
  }

  allStepsCompleted() {
    return this.completedSteps() === this.totalSteps();
  }

  /*addQuestion = (type) => {
    console.log(type)
    let temp = Object.assign(this.state.questionList);
    let count = temp.length;
    let index = count + 1;
    temp.push(<Question addQuestion={this.addQuestion} validateForm={this.state.validateForm} validationResponse={this.handleValidationResponse} index={index} triggeredByAnswerType={type}/>)
    this.setState({questionList: temp})
  }*/

  addQuestion = (type) => {
    let temp = this.state.numQuestions
    temp += 1
    this.setState({numQuestions: temp, triggerAnswerType: type})
  }

  creatQuestions = (num) => {
    var questions = [];
    for(let i = 1; i < num; i++){
        questions.push(<Question addQuestion={this.addQuestion} validateForm={this.state.validateForm} validationResponse={this.handleQuestionsValidationResponse} index={i} triggeredByAnswerType={this.state.triggerAnswerType}/>);
    }
    return questions;
  }

  save = () => {
    this.setState({validateForm: true})
  }

  handleQuestionsValidationResponse = (response) => {
    console.log(response)

    if(response === false){
      this.setState({questionConfigError: true})
    }else{
      let temp = Object.assign(this.state.completed)
      temp[0] = true
      this.setState({completed: temp, questionConfigError: false})
    }

    this.setState({validateForm: false})
  }
  handleNotificationsValidationResponse = (response) => {
    console.log(response)

    
    if(response === false){
      this.setState({notificationConfigError: true})
    }else{
      let temp = Object.assign(this.state.completed)
      temp[1] = true
      this.setState({completed: temp, notificationConfigError: false})
    }

    this.setState({validateForm: false})
  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep, questionList } = this.state;    

    return (
      <div>
        <Modal
          style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.props.open}
          onClose={this.handleClose}
        >
            <Card style={{textAlign: 'center', backgroundColor: 'white', width: '75%', height: '75%'}}>
                <CardHeader style={{textAlign: 'center'}} title={this.state.configName}/>
                <CardContent style={{height: '75%'}}>
                  <div>
                    <Stepper nonLinear activeStep={activeStep}>
                    {steps.map((label, index) => {
                        return (
                        <Step key={label}>
                            <StepLabel
                            error={(index === 0 && this.state.questionConfigError) || (index === 1 && this.state.notificationConfigError)}
                            onClick={this.handleStep(index)}
                            completed={this.state.completed[index]}
                            >
                            {label}
                            </StepLabel>
                        </Step>
                        );
                    })}
                    </Stepper>
                  </div>
                  <div style={{overflowY: 'auto', height: '85%'}}>
                    <div style={{display: activeStep == 0 ? 'block' : 'none', padding: '1rem'}}>
                      {this.creatQuestions(this.state.numQuestions)}
                    </div>

                    <div style={{display: activeStep == 1 ? 'block' : 'none', padding: '1rem'}}>
                      <NotificationDetails validateForm={this.state.validateForm} validationResponse={this.handleNotificationsValidationResponse}/>
                    </div>
                  </div>
                </CardContent>
                <CardActions style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Button
                    disabled={activeStep === 0}
                    onClick={this.handleBack}
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    >
                    Back
                    </Button>
                    <Button
                    style={{display: activeStep === 1 ? 'none' : 'block'}}
                    variant="contained"
                    color="primary"
                    onClick={this.handleNext}
                    className={classes.button}
                    >
                    Next
                    </Button>
                    <Button
                    style={{backgroundColor: '#009603', display: activeStep === 1 ? 'block' : 'none'}}
                    variant="contained"
                    onClick={this.save}
                    className={classes.button}
                    >
                    Save
                    </Button>
                </CardActions>
            </Card>
        </Modal>
      </div>
    );
  }
}

const ConfigModalWrapped = withStyles(styles)(ConfigModal);

export default ConfigModalWrapped;
