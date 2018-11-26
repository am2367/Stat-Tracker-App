import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Question from './Question.js';
import NotificationDetails from './NotificationDetails.js';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Close from '@material-ui/icons/Close';
import checkSession from './CheckSession.js';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
  },
  configNameInput : {
    fontSize: '1.5rem'
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
            confirmDeleteWindow: false,
            activeStep: 0,
            questionValidations: {},
            completed: {},
            validateQuestionForm: false,
            validateNotificationForm: false,
            questionConfigError: false,
            notificationConfigError: false,
            newConfigName: false,
            configNameError: false,
            configNameErrorText: '',
            sendQuestionData: false,
            sendNotificationData: false,
            nextNotification: ''
         }, this.props.data)
  }
  
  state = {}

  handleClose = () => {
    this.props.onClose();
  };

  componentWillMount = () => {
    let thisRef = this
    checkSession(function(result){
      if(result === false){
        thisRef.redirect()
      }else{
        if(thisRef.props.data.active){
          thisRef.getNextNotificationTime()
        }
      }
    })
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
        questions.push(<Question 
                          deleteQuestion={this.deleteQuestion}
                          questionData={this.handleQuestionData} 
                          sendQuestionData={this.state.sendQuestionData} 
                          data={this.state.questionData[i]} 
                          addQuestion={this.addQuestion} 
                          validateForm={this.state.validateQuestionForm} 
                          validationResponse={this.handleQuestionsValidationResponse}/>);
    }
    return questions;
  }

  deleteQuestion = (index) => {
    let tempQuestions = Object.assign(this.state.questionData)
    let tempNumQuestions = Object.assign(this.state.numQuestions)
    
    tempNumQuestions -= 1
    tempQuestions[index-1].triggersQuestion === false
    delete tempQuestions[index]
    
    this.setState({questionData: tempQuestions, numQuestions: tempNumQuestions})
  }

  deleteConfiguration = () => {
    this.setState({confirmDeleteWindow: false})
    this.props.deleteConfiguration(this.state.configName)
    this.handleClose()
  }

  openConfirmDeleteWindow = () => {
    this.setState({confirmDeleteWindow: true})
  }

  triggerFormValidation = () => {
    let thisRef = this
    checkSession(function(result){
      if(result === false){
        thisRef.redirect()
      }else{
        thisRef.checkConfigName()
        thisRef.setState({validateQuestionForm: true, validateNotificationForm: true})
      }
    })
  }

  checkConfigName = () => {
    let response = this.props.validateNewConfigName(this.state.configName);

    if(response !== true){
      this.setState({configNameError: true, configNameErrorText: response})
      return false
    }else{
      console.log("Valid new config name")
      this.setState({configNameError: false})
      return true
    }
  }

  handleConfigNameValidation = () => {
    let thisRef = this
    checkSession(function(result){
      if(result === false){
        thisRef.redirect()
      }else{
        if(!thisRef.checkConfigName()){
          return
        }

        //trigger event to recieve question and notification data from their states 
        thisRef.setState({sendQuestionData: true, sendNotificationData: true})
      }
    })
  }

  handleCloseConfirmDeleteWindow = () => {
    this.setState({confirmDeleteWindow: false})
  }

  save = () => {
  
    console.log('Saving!')

    fetch('/api/config/update', {
      method: 'post',
      headers: {
          'Content-type': 'application/json'},
      body: JSON.stringify({configName: this.state.configName,
                            active: this.state.active,
                            numQuestions: this.state.numQuestions,
                            triggerAnswerType: this.state.triggerAnswerType,
                            questionData: this.state.questionData,
                            notificationData: this.state.notificationData})
    })
    .then(response => response.json())
    .then(data=>{
        if(data === 'Updated'){
          alert('Saved!')
          this.props.refreshData()
          this.handleClose()
        }
    })
  }

  activate = () => {
  
    console.log('Activating!')

    fetch('/api/config/activate', {
      method: 'post',
      headers: {
          'Content-type': 'application/json'},
      body: JSON.stringify({configName: this.state.configName,
                            active: this.state.active,
                            numQuestions: this.state.numQuestions,
                            triggerAnswerType: this.state.triggerAnswerType,
                            questionData: this.state.questionData,
                            notificationData: this.state.notificationData})
    })
    .then(response => response.json())
    .then(data=>{
        if(data !== 'Error'){
          alert(data)
          this.props.refreshData()
          this.handleClose()
        }
    })
  }

  deactivate = () => {
  
    console.log('Deactivating!')

    fetch('/api/config/deactivate', {
      method: 'post',
      headers: {
          'Content-type': 'application/json'},
      body: JSON.stringify({configName: this.state.configName,
                            active: this.state.active,
                            numQuestions: this.state.numQuestions,
                            triggerAnswerType: this.state.triggerAnswerType,
                            questionData: this.state.questionData,
                            notificationData: this.state.notificationData})
    })
    .then(response => response.json())
    .then(data=>{
        if(data === 'Updated'){
          alert('Deactivated!')
          this.props.refreshData()
          this.handleClose()
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
      this.setState({notificationConfigError: true, validateNotificationForm: false, completed: tempCompleted}, () => {
                      
        while(Object.keys(this.state.questionValidations).length !== this.state.numQuestions){
          continue
        }
        this.setState({questionValidations: {}, validateQuestionForm: false})
      })
    }else{
      tempCompleted[1] = true
      this.setState({completed: tempCompleted, 
                    notificationConfigError: false, 
                    notificationData: response, 
                    validateNotificationForm: false}, () => {
                      
        while(Object.keys(this.state.questionValidations).length !== this.state.numQuestions){
          continue
        }
        this.setState({questionValidations: {}, validateQuestionForm: false, active: this.state.active ? false : true}, () => {
          if(!Object.values(this.state.completed).includes(false) 
          && !this.state.validateQuestionForm 
          && !this.state.validateNotificationForm
          && !this.state.configNameError){
          
          //console.log("Validated", this.state)
          if(this.state.active){
            this.activate()
          }else{
            this.deactivate()
          }
        }
        })
      })
    }
  }

  handleQuestionData = (index, data) => {
    let tempQuestionData = Object.assign(this.state.questionData)
    let tempQuestionValidations = Object.assign(this.state.questionValidations)

    tempQuestionData[data.index] = data
    tempQuestionValidations[index] = true

    this.setState({questionData: tempQuestionData,  
                   questionValidations: tempQuestionValidations})
  }

  handleNotificationData = (data) => {
    this.setState({notificationData: data, 
                  sendNotificationData: false}, () => {
        
      while(Object.keys(this.state.questionValidations).length !== this.state.numQuestions){
        continue
      }
      
      this.setState({questionValidations: {}, sendQuestionData: false}, () => {
        if(!this.state.configNameError){
        //console.log("Validated", this.state)
          this.save();
        }
      })
    })
  }

  getNextNotificationTime = () => {
    fetch('/api/config/getNextNotificationTime?configName=' + this.state.configName)
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
      if(data !== 'Error'){
        let datetime = moment(data).format('LLLL')
        this.setState({nextNotification: datetime})
      }
    })
  }

  handleConfigNameChange = event => {
    this.setState({ configName: event.target.value, newConfigName: true});
  };

  redirect = () => {
    this.props.history.push('/Login');
  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep, questionList } = this.state;    

    return (
      <Router> 

      <div>
        
        <Modal
          style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.props.open}
          onClose={this.handleClose}
        >
            <Card style={{textAlign: 'center', backgroundColor: 'white', width: '75%', height: '75%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <CardContent style={{height: '100%', display: 'flex', padding: 0, flexDirection: 'column', justifyContent: 'space-between'}}>
                  <div style={{flexDirection: 'row', justifyContent: 'space-between', display: 'flex'}}> 
                    <Grid item  xs={3} sm={3} md={3} lg={3} style={{textAlign: 'start'}}>
                      <Button variant={this.state.active ? 'contained' : 'outlined'} color="primary" style={{margin: '1rem'}} onClick={() => this.triggerFormValidation()}>
                        {this.state.active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button variant={'outlined'} color='secondary' style={{margin: '1rem'}} onClick={() => this.openConfirmDeleteWindow()}>
                        Delete
                      </Button>
                    </Grid>
                    <Grid item  xs={6} sm={6} md={6} lg={6}>
                      <FormControl error={this.state.configNameError}>
                        <TextField
                                      value={this.state.configName}
                                      error={this.state.configNameError}
                                      margin="normal"
                                      autoFocus
                                      InputProps={{
                                        classes: {
                                          input: classes.configNameInput
                                        }
                                      }}
                                      id="configName" 
                                      variant="outlined"
                                      label="Configuration Name"
                                      onChange={this.handleConfigNameChange}
                                      />
                          <FormHelperText style={{display: this.state.configNameError ? 'block' : 'none'}}>{this.state.configNameErrorText}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item  xs={3} sm={3} md={3} lg={3} style={{textAlign: 'end'}}>
                        <Close style={{width: '2em', height: '2em', fill: 'rgba(0, 0, 0, 0.54)', cursor: 'pointer'}} onClick={this.handleClose}/>
                      </Grid>
                    </div>
                  <div>
                    <Stepper nonLinear activeStep={activeStep}>
                    {steps.map((label, index) => {
                        return (
                        <Step key={label}>
                            <StepLabel
                            error={(index === 0 && this.state.questionConfigError) || (index === 1 && this.state.notificationConfigError)}
                            onClick={this.handleStep(index)}
                            completed={this.state.completed[index]}
                            style={{cursor: 'pointer'}}
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
                      <NotificationDetails 
                        notificationData={this.handleNotificationData}
                        sendNotificationData={this.state.sendNotificationData} 
                        data={this.state.notificationData} 
                        validateForm={this.state.validateNotificationForm} 
                        validationResponse={this.handleNotificationsValidationResponse}
                      />
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
                    <Typography variant="title" color="textPrimary" gutterBottom>
                      {this.state.active ? 'Next notification: ' + this.state.nextNotification : ''}
                    </Typography>
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
                    style={{backgroundColor: '#009603', color: 'white', display: activeStep === 1 ? 'block' : 'none'}}
                    variant="contained"
                    onClick={this.handleConfigNameValidation}
                    className={classes.button}
                    >
                    Save
                    </Button>
                </CardActions>
            </Card>
        </Modal>
        <Dialog
            open={this.state.confirmDeleteWindow}
            onClose={this.handleCloseConfirmDeleteWindow}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Delete Configuration?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this configuration?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseConfirmDeleteWindow} color="primary">
                Cancel
              </Button>
              <Button variant='contained' color='secondary' onClick={this.deleteConfiguration}  autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
      </div>
      </Router> 
    );
  }
}

const ConfigModalWrapped = withStyles(styles)(ConfigModal);
const ConfigModalWrappeddWithRouter = withRouter(ConfigModalWrapped)
export default ConfigModalWrappeddWithRouter;
