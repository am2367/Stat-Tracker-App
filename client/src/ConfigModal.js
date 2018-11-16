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
  constructor(props) {
    super(props)
    this.state = Object.assign({},{
            activeStep: 0,
            questionValidations: {},
            validateQuestionForm: false,
            validateNotificationForm: false,
            questionConfigError: false,
            notificationConfigError: false
         }, this.props.data)
         console.log(this.state)
  }
  
  state = {}

  handleClose = () => {
    this.props.onClose();
  };

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

  addQuestion = (type) => {
    let temp = Object.assign(this.state.numQuestions)
    temp += 1
    let tempQuestionData = Object.assign(this.state.questionData)
    tempQuestionData[temp] = {
      type: '',
      index: temp,
      question: '',
      triggersQuestion: false,
      triggeredByAnswer: '',
      triggeredByAnswerScale: [],
      triggeredByAnswerType: type
    }
    this.setState({questionData: tempQuestionData, numQuestions: temp}, () => {
      //console.log(this.state.questionData)
    })
  }

  creatQuestions = (num) => {
    var questions = [];
    for(let i = 1; i <= num; i++){
        questions.push(<Question data={this.state.questionData[i]} addQuestion={this.addQuestion} validateForm={this.state.validateQuestionForm} validationResponse={this.handleQuestionsValidationResponse}/>);
    }
    return questions;
  }

  triggerFormValidation = () => {
    this.setState({validateQuestionForm: true, validateNotificationForm: true})
  }

  save = () => {
    console.log('Saving!')

    fetch('/api/updateConfig', {
      method: 'post',
      headers: {
          'Content-type': 'application/json'},
      body: JSON.stringify({configName: this.state.configName,
                            active: this.state.active,
                            numQuestions: this.state.numQuestions,
                            completed: this.state.completed,
                            triggerAnswerType: this.state.triggerAnswerType,
                            questionData: this.state.questionData,
                            notificationData: this.state.notificationData})
    })
    .then(response => response.json())
    .then(data=>{
        if(data == 'Saved!'){
            alert('Saved!')
        }
    })
  }

  handleQuestionsValidationResponse = (index, response) => {
   // console.log(response)
    
    let tempQuestionValidations = Object.assign(this.state.questionValidations)
    let tempCompleted = Object.assign(this.state.completed)

    if(response === false){
      tempCompleted[0] = false
      tempQuestionValidations[index] = false
      this.setState({questionConfigError: true, questionValidations: tempQuestionValidations, completed: tempCompleted})
    }else{
      let tempQuestionData = Object.assign(this.state.questionData)
      tempCompleted[0] = true
      tempQuestionValidations[index] = true
      tempQuestionData[response.index] = response
      this.setState({completed: tempCompleted, 
                    questionConfigError: false, 
                    questionData: tempQuestionData,  
                    questionValidations: tempQuestionValidations})
    }
  }

  handleNotificationsValidationResponse = (response) => {
    //console.log(response)
    let tempCompleted = Object.assign(this.state.completed)

    if(response === false){
      tempCompleted[1] = false
      this.setState({notificationConfigError: true, validateNotificationForm: false, completed: tempCompleted})
    }else{
      tempCompleted[1] = true
      this.setState({completed: tempCompleted, 
                    notificationConfigError: false, 
                    notificationData: response, 
                    validateNotificationForm: false}, () => {
                      
        while(Object.keys(this.state.questionValidations).length !== this.state.numQuestions){
          continue
        }
        this.setState({questionValidations: {}, validateQuestionForm: false}, () => {
          if(!Object.values(this.state.completed).includes(false) 
          && !this.state.validateQuestionForm 
          && !this.state.validateNotificationForm){
          
          //console.log("Validated", this.state)
          this.save();
        }
        })
      })
    }
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
                      <NotificationDetails data={this.state.notificationData} validateForm={this.state.validateNotificationForm} validationResponse={this.handleNotificationsValidationResponse}/>
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
                    onClick={this.triggerFormValidation}
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
