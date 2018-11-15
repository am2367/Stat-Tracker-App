import React from "react";
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
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
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

const styles = theme => ({
});

function numberRange (start, end) {
    return new Array(end - start).fill().map((d, i) => i + start);
}

class NotificationDetails extends React.Component {
  state={notificationType: '',
         onDays: [],
         messageTimeType: '',
         everyHours: 0,
         everyMinutes: 0,
         atTime: "",
         summary: '',
         validateForm: this.props.validateForm,
         notificationTypeError: false,
         onDaysError: false,
         atTimeError: false,
         everyHoursMinutesError: false,
         messageTimeTypeError: false,
         formErrors: false}

  componentWillReceiveProps = (nextProps) => {
    this.setState({validateForm: nextProps.validateForm})
  }

  handleTypeChange = event => {
    this.setState({notificationType: event.target.value }, () => {
        this.getSummary();
    });
  };

  handleDayChange = day => () => {
    let tempDays = Object.assign(this.state.onDays)

    if(tempDays.includes(day)){
        tempDays.splice( tempDays.indexOf(day), 1 );
    }else{
        tempDays.push(day);
    }
    this.setState({tempDays}, ()=> {
        this.getSummary();
    })
  }

  handleMessageTimeTypeChange = type => () => {
    this.setState({messageTimeType: type}, ()=> {
        this.getSummary();
    })

  }

  handleEveryHoursTimeChange = event => {
    this.setState({everyHours: event.target.value}, ()=> {
        this.getSummary();
    })
  }

  handleEveryMinutesTimeChange = event => {
    this.setState({everyMinutes: event.target.value}, ()=> {
        this.getSummary();
    })

    
  }

  handleMessageAtTimeChange = event => {
    this.setState({atTime: event.target.value}, ()=> {
        this.getSummary();
    })
  }

  getSummary = () => {
    let message = ""
    if(this.state.notificationType !== '' && this.state.onDays !== []){
        message += "Send me a(n) " + this.state.notificationType.toLowerCase() + " on " + this.state.onDays

        if(this.state.messageTimeType === 'At'){
            if(parseInt(this.state.atTime.split(':')[0]) < 12 && this.state.atTime != ""){
                message += " at " + this.state.atTime
                message += " AM "
            } 
            else if(this.state.atTime != ""){
                message += " at " + this.state.atTime
                message += " PM "
            }
        }
        
        else if(this.state.messageTimeType === 'Every'){
            message += " every " + this.state.everyHours + " Hours and " + this.state.everyMinutes + " Minutes"
        }
    }else{
        message = "Choose notification type and notification days to get summary"
    }

    this.setState({summary: message})
  }

  validateNotification = () => {
    let formErrors = false
    this.setState({everyHoursMinutesError: false, atTimeError: false, messageTimeTypeError: false, notificationTypeError: false, onDaysError: false})

    if(this.state.notificationType === ''){
        this.setState({notificationTypeError: true})
        formErrors = true
    }

    if(this.state.onDays.length === 0){
        this.setState({onDaysError: true})
        formErrors = true
    }

    if(this.state.messageTimeType === ''){
        this.setState({messageTimeTypeError: true})
        formErrors = true
    }else if(this.state.messageTimeType === 'At' && this.state.atTime === ""){
        this.setState({atTimeError: true, formErrors: true})
        formErrors = true
    }else if(this.state.messageTimeType === 'Every' && (this.state.everyHours === 0 || this.state.everyMinutes === 0)){
        this.setState({everyHoursMinutesError: true, formErrors: true})
        formErrors = true
    }

    if(!formErrors){
        this.props.validationResponse(this.state)
    }
    else{
        this.props.validationResponse(false)
    }
    
    this.setState({validateForm: false})
  }

  render() {
    const { classes } = this.props;
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    {this.state.validateForm ? this.validateNotification() : null} 

    return (
        <Card>
            <div style={{width: '100%', display: 'flex', marginBottom: '1rem'}}>
                <Grid item  xs={12} sm={12} md={2} lg={3} style={{alignItems: 'center', display: 'flex', paddingLeft: '2rem'}}>
                    <Typography variant="title" color="textPrimary" gutterBottom>
                        Notification Type
                    </Typography>
                </Grid>
                <Grid item  xs={12} sm={12} md={10} lg={10} style={{textAlign: 'left'}}>
                    <FormControl error={this.state.notificationTypeError}>
                        <RadioGroup
                            style={{flexDirection: 'row', borderBottom: this.state.notificationTypeError ? '2px solid red'  : ''}}
                            name="notificationType"
                            value={this.state.notificationType}
                            onChange={this.handleTypeChange}
                        >
                            <FormControlLabel value="Text" control={<Radio />} label="Text" />
                            <FormControlLabel value="Email" control={<Radio />} label="Email" />
                        </RadioGroup>
                        <FormHelperText style={{display: this.state.notificationTypeError ? 'block' : 'none'}}>Choose a notification type</FormHelperText>
                    </FormControl>
                </Grid>
            </div>

            <div style={{width: '100%', display: 'flex',  marginBottom: '1rem'}}>
                <Grid item  xs={12} sm={12} md={2} lg={3} style={{alignItems: 'center', display: 'flex', paddingLeft: '2rem'}}>
                    <Typography variant="title" color="textPrimary" gutterBottom>
                        On
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={10} lg={10} style={{textAlign: 'left'}}>
                    <FormControl error={this.state.onDaysError}>
                        <div style={{borderBottom: this.state.onDaysError ? '2px solid red'  : ''}}>

                            {daysOfWeek.map((day, index) => {
                                return(
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                        checked={this.state.onDays.includes(day)}
                                        onChange={this.handleDayChange(day)}
                                        value={day}
                                        label={day}
                                        color="primary"
                                        />
                                    }
                                    label={day}
                                />)
                            })}
                        </div>
                        <FormHelperText style={{display: this.state.onDaysError ? 'block' : 'none'}}>Choose at least one day</FormHelperText>
                    </FormControl>
                </Grid>
            </div>

            <div style={{width: '100%', display: 'flex',  marginBottom: '1rem'}}>
                <Grid item  xs={12} sm={12} md={2} lg={3} style={{alignItems: 'center', display: 'flex', paddingLeft: '2rem'}}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.messageTimeType === 'At'}
                                onChange={this.handleMessageTimeTypeChange('At')}
                                value="At"
                            />
                        }
                        label="At"
                        style={{borderBottom: this.state.messageTimeTypeError ? '2px solid red'  : ''}}
                    />
                </Grid>
                <Grid item  xs={12} sm={12} md={10} lg={10} style={{textAlign: 'left'}}>
                    <TextField
                        error={this.state.atTimeError}
                        disabled={this.state.messageTimeType !== 'At'}
                        id="time"
                        type="time"
                        defaultValue=""
                        value= {this.state.atTime}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        inputProps={{
                        step: 60, // 1 min
                        }}
                        onChange={this.handleMessageAtTimeChange}
                    />
                </Grid>
            </div>

            <div style={{width: '100%', display: 'flex',  marginBottom: '1rem'}}>
                <Grid item  xs={12} sm={12} md={2} lg={3} style={{alignItems: 'center', display: 'flex', paddingLeft: '2rem'}}>
                        <FormControlLabel
                            control={
                                <Switch
                                    
                                    checked={this.state.messageTimeType === 'Every'}
                                    onChange={this.handleMessageTimeTypeChange('Every')}
                                    value="Every"
                                />
                            }
                            label="Every"
                            style={{borderBottom: this.state.messageTimeTypeError ? '2px solid red'  : ''}}
                        />
                </Grid>
                <Grid item  xs={12} sm={12} md={10} lg={10} style={{textAlign: 'left'}}>
                    <FormControl error={this.state.everyHoursMinutesError} disabled={this.state.messageTimeType !== 'Every'} variant="outlined" className={classes.formControl} style={{marginRight: '1rem', width: '5rem'}}>
                        <InputLabel
                            ref={ref => {
                            this.InputLabelRef = ref;
                            }}
                            htmlFor="outlined-age-simple"
                        >
                            Hours
                        </InputLabel>
                        <Select
                            value={this.state.everyHours}
                            onChange={this.handleEveryHoursTimeChange}
                            input={
                                <OutlinedInput
                                labelWidth={0}
                                name="hours"
                                id="hours"
                                />
                            }
                            >
                            {numberRange(0, 24).map((hour, index) => {
                                return(
                                    <MenuItem value={hour}>{hour}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <FormControl error={this.state.everyHoursMinutesError} disabled={this.state.messageTimeType !== 'Every'} variant="outlined" className={classes.formControl}  style={{width: '5rem'}}>
                        <InputLabel
                            ref={ref => {
                            this.InputLabelRef = ref;
                            }}
                            htmlFor="outlined-age-simple"
                        >
                            Minutes
                        </InputLabel>
                        <Select
                            value={this.state.everyMinutes}
                            onChange={this.handleEveryMinutesTimeChange}
                            input={
                                <OutlinedInput
                                labelWidth={0}
                                name="minutes"
                                id="minutes"
                                />
                            }
                            >
                            {numberRange(0, 60).map((minute, index) => {
                                return(
                                    <MenuItem value={minute}>{minute}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </Grid>
            </div>
            <FormControl error={this.state.messageTimeTypeError}>
                <FormHelperText style={{display: this.state.messageTimeTypeError ? 'block' : 'none'}}>Choose a time or interval for notifications</FormHelperText>
            </FormControl>
            <div style={{width: '100%', display: 'flex',  marginBottom: '1rem', marginLeft: '1rem'}}>
                <Typography variant="title" color="textPrimary" gutterBottom>
                    {this.state.summary}
                </Typography>
            </div>

        </Card>
    );
  }
}

const NotificationDetailsWrapped = withStyles(styles)(NotificationDetails);

export default NotificationDetailsWrapped;
