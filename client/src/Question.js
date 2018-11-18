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
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Badge from '@material-ui/core/Badge';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
    questionBadge: {
        right: 'unset',
        left: '-11px'
    },
    triggeredByBadge: {
        right: 'unset',
        top: '-13px'
    }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function numberRange (start, end) {
    return new Array(end - start).fill().map((d, i) => i + start);
}

class Question extends React.Component {
    constructor(props) {
        super(props)
        this.state = Object.assign({},
                    {
                    questionError: false,
                    typeError: false,
                    triggeredByAnswerScaleError: false,
                    triggeredByAnswerError: false,
                    validateForm: this.props.validateForm,
                    sendQuestionData: this.props.sendQuestionData
                    }, this.props.data)
    }
    
  componentWillReceiveProps = (nextProps) => {
    this.setState({validateForm: nextProps.validateForm, sendQuestionData: nextProps.sendQuestionData})
  }

  handleTypeChange = event => {
    this.setState({ type: event.target.value });
  };

  handleQuestionChange = event => {
    this.setState({ question: event.target.value });
  };

  addQuestion = () => {
      this.props.addQuestion(this.state.type);
      this.setState({triggersQuestion: true})
  }

  handleChangeTriggeredByAnswer = event => {
    this.setState({triggeredByAnswer: event.target.value });
  };

  handleChangeTriggeredByAnswerScale = event => {
    this.setState({triggeredByAnswerScale: event.target.value });
  };

  getAnswerOption = () => {

    let triggeredByAnswerType = this.state.triggeredByAnswerType;

    if(triggeredByAnswerType === 'yes/no'){
        return(
        <Select
        style={{border: this.state.triggeredByAnswerError ? '1px solid red'  : '', 
                borderRadius: this.state.triggeredByAnswerError ? '4px' : ''}}
        value={this.state.triggeredByAnswer}
        onChange={this.handleChangeTriggeredByAnswer}
        input={
            <OutlinedInput
            name="answer"
            id="answer"
            />
        }
        >
            <MenuItem value={'yes'}>Yes</MenuItem>
            <MenuItem value={'no'}>No</MenuItem>
        </Select>
        )
    }else{
        let scale = parseInt(triggeredByAnswerType);
        let scaleList = numberRange(1, scale+1);
        return(
        <Select
        multiple
        style={{border: this.state.triggeredByAnswerScaleError ? '1px solid red'  : '', 
                borderRadius: this.state.triggeredByAnswerScaleError ? '4px' : ''}}
        value={this.state.triggeredByAnswerScale}
        onChange={this.handleChangeTriggeredByAnswerScale}
        MenuProps={MenuProps}
        input={
            <OutlinedInput
                name="answer"
                id="answer"
            />
            }
        >
        {scaleList.map(number => (
            <MenuItem key={number} value={number}>
            {number}
            </MenuItem>
        ))}
        </Select>)
    }
  }

  validateQuestions = () => {
    let formErrors = false
    this.setState({questionError: false, triggeredByAnswerError: false, triggeredByAnswerScaleError: false, typeError: false})

    if(this.state.question === ''){
        this.setState({questionError: true})
        formErrors = true
    }

    if(this.state.type === ''){
        this.setState({typeError: true})
        formErrors = true
    }

    if(this.state.triggeredByAnswerType !== ''){
        if(this.state.triggeredByAnswerType === "yes/no" && this.state.triggeredByAnswer === ''){
            this.setState({triggeredByAnswerError: true})
            formErrors = true
        }
        else if(this.state.triggeredByAnswerType !== "yes/no" && this.state.triggeredByAnswerScale.length === 0){
            this.setState({triggeredByAnswerScaleError: true})
            formErrors = true
        }
    }

    if(!formErrors){
        this.props.validationResponse(this.state.index, 
                                                        {
                                                            type: this.state.type,
                                                            index: this.state.index,
                                                            question: this.state.question,
                                                            triggeredByAnswer: this.state.triggeredByAnswer,
                                                            triggeredByAnswerScale: this.state.triggeredByAnswerScale,
                                                            triggeredByAnswerType: this.state.triggeredByAnswerType
                                                        })
    }else{
        this.props.validationResponse(this.state.index, false)
    }
    
    this.setState({validateForm: false})
  }

  sendQuestionData = () => {
    console.log('Sending question data')
    this.props.questionData(this.state.index, 
        {
            type: this.state.type,
            index: this.state.index,
            question: this.state.question,
            triggeredByAnswer: this.state.triggeredByAnswer,
            triggeredByAnswerScale: this.state.triggeredByAnswerScale,
            triggeredByAnswerType: this.state.triggeredByAnswerType
        })
    //this.setState({sendQuestionData: false})
  }

  render() {
    const { classes } = this.props;

    {this.state.validateForm ? this.validateQuestions() : null}    
    {this.state.sendQuestionData ? this.sendQuestionData() : null}

    return (
        <Badge style={{width: '95%'}} classes={{badge: classes.questionBadge}} badgeContent={this.state.index} color="primary">
            <Card style={{marginBottom: '1rem', width: '100%'}}>
                <div style={{width: '100%', display: this.state.index !== 1 ? 'flex' : 'none', marginTop: '1rem'}}>
                    <Grid item  xs={12} sm={12} md={6} lg={6} style={{alignItems: 'center', display: 'flex', paddingLeft: '2rem'}}>
                        <Typography variant="title" color="textPrimary" gutterBottom>
                            Triggered By Question <Badge classes={{badge: classes.triggeredByBadge}} badgeContent={this.state.index - 1} color="primary"/>
                        </Typography>
                    </Grid>
                </div>
                <div style={{width: '100%', display: this.state.index !== 1 ? 'flex' : 'none', marginTop: '1rem'}}>
                    <Grid item  xs={12} sm={12} md={2} lg={2} style={{alignItems: 'center', display: 'flex', paddingLeft: '2rem'}}>
                        <Typography variant="title" color="textPrimary" gutterBottom>
                            Answer
                        </Typography>
                    </Grid>
                    <Grid item  xs={12} sm={12} md={10} lg={10} style={{alignItems: 'center', display: 'flex'}}>
                            {this.state.triggeredByAnswerType !== '' ? this.getAnswerOption() : ''}
                    </Grid>
                </div>
                <div style={{width: '100%', display: 'flex', marginTop: '1rem'}}>
                    <Grid item  xs={12} sm={12} md={2} lg={2} style={{alignItems: 'center', display: 'flex', paddingLeft: '2rem'}}>
                        <Typography variant="title" color="textPrimary" gutterBottom>
                            Question
                        </Typography>
                    </Grid>
                    <Grid item  xs={12} sm={12} md={10} lg={10}>
                        <TextField
                                value={this.state.question}
                                error={this.state.questionError}
                                style={{width: '100%'}}
                                id="question" 
                                variant="outlined"
                                label="Question"
                                onChange={this.handleQuestionChange}
                                />
                    </Grid>
                </div>

                <div style={{width: '100%', display: 'flex'}}>
                    <Grid item  xs={12} sm={12} md={2} lg={2} style={{alignItems: 'center', display: 'flex', paddingLeft: '2rem'}}>
                        <Typography variant="title" color="textPrimary" gutterBottom>
                            Type
                        </Typography>
                    </Grid>
                    <Grid item  xs={12} sm={12} md={10} lg={10}>
                        <FormControl error={this.state.typeError}>
                            <RadioGroup
                                name="type"
                                value={this.state.type}
                                onChange={this.handleTypeChange}
                                style={{flexDirection: 'row', 
                                        borderBottom: this.state.typeError ? '2px solid red'  : ''}}
                            >
                                <FormControlLabel value="yes/no" control={<Radio />} label="Yes / No" />
                                <FormControlLabel value="5" control={<Radio />} label="Scale 1-5" />
                                <FormControlLabel value="10" control={<Radio />} label="Scale 1-10" />
                                <FormControlLabel value="20" control={<Radio />} label="Scale 1-20" />
                                <FormControlLabel value="50" control={<Radio />} label="Scale 1-50" />
                                <FormControlLabel value="100" control={<Radio />} label="Scale 1-100" />
                            </RadioGroup>
                            <FormHelperText style={{display: this.state.typeError ? 'block' : 'none'}}>Choose an answer type</FormHelperText>
                        </FormControl>
                    </Grid>
                </div>

                <div style={{width: '100%', marginBottom: '1rem', display: this.state.triggersQuestion ? 'none' : 'block'}}>
                    <Button disabled={this.state.type === '' || this.state.question === ''} variant="contained" color="primary" onClick={this.addQuestion}>
                        Trigger Another Question
                    </Button>
                </div>
                <div style={{width: '100%', marginBottom: '1rem', display: this.state.triggersQuestion ? 'block' : 'none'}}>
                    <Typography variant="title" color="textPrimary" gutterBottom>
                        Triggers Question <Badge classes={{badge: classes.triggeredByBadge}} badgeContent={this.state.index + 1} color="primary"/>
                    </Typography>
                </div>
            </Card>
        </Badge>
    );
  }
}

const QuestionWrapped = withStyles(styles)(Question);

export default QuestionWrapped;
