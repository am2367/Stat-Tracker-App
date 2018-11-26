import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import checkSession from './CheckSession.js';
import ConfigModal from './ConfigModal.js';
import AddIcon from '@material-ui/icons/Add';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import { DatePicker } from 'material-ui-pickers';
import moment from 'moment'
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import { VictoryBar, VictoryChart, VictoryAxis,
    VictoryTheme, VictoryLabel } from 'victory';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
  root: {
    flexGrow: 1,
  }
});

class Analytics extends React.Component {
  state = {
            data: {},
            graphData: [],
            startDate: new Date(),
            endDate: new Date(),
            startTime: "",
            endTime: "",
            daysOfTheWeek: [],
            months: [],
            reponseDates: [],
            availableMonths: [],
            availableDaysOfTheWeek : [],
            open: false,
           }

  componentWillMount = () => {
    let thisRef = this
    checkSession(function(result){
      if(result === false){
        thisRef.redirect()
      }else{
        thisRef.getResponseData()
        thisRef.getResponseDates()
        thisRef.handleAvailableMonths()
        thisRef.handleAvailableDays()
      }
    })
  }

  handleMonthsChange = event => {
    this.setState({ months: event.target.value });
  };

  handleDaysOfTheWeekChange = event => {
    this.setState({ daysOfTheWeek: event.target.value });
  };


  getResponseDates = () => {
    fetch('/api/responses/getDates')
        .then(this.handleErrors)
        .then(response => response.json())
        .then(data=>{
        if(data){
            this.handleAvailableDates(data)
        }else{
            console.log(data)
        }
    })
  }

  handleAvailableDates = (data) => {
    let dates = Object.keys(data).map((entry, index) => {
        console.log(entry)
        let date = data[entry].Date
        return(date)
    })
    console.log(dates)
    
    this.setState({responseDates: dates}, () => {
     
    })
  }

  handleAvailableDays = () => {
    let daysOfTheWeek = []

    let startDate = moment(this.state.startDate)
    let endDate = moment(this.state.endDate)

    console.log('change days')
    if(startDate.format('dddd') === endDate.format('dddd')){
        daysOfTheWeek.push(startDate.format('dddd'));
    }
    else{
        while (endDate > startDate && daysOfTheWeek.length !== 7) {
            if(!daysOfTheWeek.includes(startDate.format('dddd'))){
                daysOfTheWeek.push(startDate.format('dddd'));
            }
            startDate.add(1,'d');
        }
    }

    console.log(daysOfTheWeek)

    this.setState({availableDaysOfTheWeek: daysOfTheWeek})
  }
  
  handleAvailableMonths = () => {
    let months = []

    let startDate = moment(this.state.startDate)
    let endDate = moment(this.state.endDate)

    while (endDate > startDate || startDate.format('M') === endDate.format('M')) {
        if(!months.includes(startDate.format('MMMM'))){
            months.push(startDate.format('MMMM'));
        }
        startDate.add(1,'month');
    }

    this.setState({availableMonths: months})

  }


  getResponseData = () => {
    fetch('/api/responses/getData?startDate='   
        + this.state.startDate
        + '&endDate='
        + this.state.endDate
        + '&startTime='
        + this.state.startTime
        + '&endTime='
        + this.state.endTime
        + '&endDate='
        + this.state.endTime
        + '&daysOfTheWeek='
        + this.state.daysOfTheWeek
        + '&months='
        + this.state.months)
        .then(this.handleErrors)
        .then(response => response.json())
        .then(data=>{
        if(data !== 'Empty'){
            console.log(data)
            this.setState({data: data, open: false}, () => {
                this.createGraphDataObject()
            })
        }else{
            console.log(data)
            this.setState({data: {}})
        }
    })
  }

  handleDrawer = (open) => {
    this.setState({ open: open });
  };

  handleStartDateChange = date => {
    this.setState({ startDate: date }, () => {
        this.handleAvailableMonths()
        this.handleAvailableDays()
    });
  };

  handleEndDateChange = date => {
    this.setState({ endDate: date }, () =>{
        this.handleAvailableMonths()
        this.handleAvailableDays()
    });
  };

  createGraphDataObject = () => {
    const data = Object.assign(this.state.data)
    let graphData = []
    
    //if there is only one date available for that range
    if(data.length === 1){
        let graphData = this.getGraphDataByHour(data[0])
        let jobName = data[0].JobName.split('_')[1]
        graphData = {Configuration: jobName, Data: graphData}
        this.setState({graphData: graphData})
    }
        //let hoursList = this.getListOfHoursInData(data)

        //if there is only one hour of data available for that date
        /*if(hoursList.length === 1){
            graphData = this.getGraphDataBy 
        }*/
    }

  getGraphDataByHour = (data) => {
    console.log(data)
    
    let graphData = Object.keys(data.Occurrence).map((occurrence, index) => {
        console.log(occurrence)
        
        let time = data.Occurrence[occurrence].QuestionIndex[1].ResponseTime
        let response = data.Occurrence[occurrence].QuestionIndex[1].Response
        return({Time: time, Response: parseInt(response)})
    })

    console.log(graphData)

    return graphData
  }

  /*getListOfHoursInData = (data) => {
      let hours = []

      Object.values(data.Occurrence).reduce((index, occurrence) => {
        if(!hours.includes(occurence.QuestionIndex[1].ResponseTime.split(':')[0])){
          hours.push(occurence.QuestionIndex[1].ResponseTime)
        }
      }, []) 

      return hours
  }*/
  redirect = () => {
    this.props.history.push('/Login');
  }


  render(){
    const { classes } = this.props;
    const startDate = this.state.startDate;
    const endDate = this.state.endDate;
    
    if(this.props.hidden){
        return('')
      } 
    else{
        return (
        <Router>
            <Grid container xs={11} sm={11} md={11} lg={11} spacing={24} style={{margin: 'auto',  marginTop: '1rem', height: '80%', padding: '12px'}}>
                <Card  style={{height: '100%', width:'100%'}}>
                    {/*<CardHeader
                        title="Analytics"
                        style={{textAlign: 'center', borderBottom: '1px solid #e0e0e0'}}
                        action={
                            <Button variant="contained" onClick={() => this.handleDrawer(this.state.open ? false : true)}>Filter</Button>
                        }
                        />*/}
                    <CardContent style={{height: '100%', padding: '0px'}}>
                        <div style={{ flexDirection: 'row', justifyContent: 'space-between', display: 'flex',  borderBottom: '1px solid #e0e0e0'}}> 
                            <Button style={{marginLeft: '1rem', marginTop: '1rem', marginBottom: '1rem'}} variant="contained" onClick={() => this.handleDrawer(this.state.open ? false : true)}>Filter</Button>
                                <Typography style={{marginTop: '1rem'}} component="h2" variant="display1" color="textPrimary" gutterBottom>
                                    Analytics
                                </Typography>
                            <Button style={{visibility: 'hidden'}}></Button>
                        </div>
                        <div style={{display: 'flex', height: '100%'}}>
                            <Grid 
                                item  
                                xs={this.state.open ? 12 : 0} 
                                sm={this.state.open ? 12 : 0} 
                                md={this.state.open ? 5 : 0} 
                                lg={this.state.open ? 5 : 0}>
                                <Paper align={'center'} square style={{display: this.state.open ? 'block' : 'none', width: '30rem', height: '100%'}}>
                                    <Typography component="h2" variant="headline">
                                        Filter
                                    </Typography>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <Grid item style={{display: 'flex'}} xs={12} sm={12} md={12} lg={12}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <DatePicker
                                                    leftArrowIcon={<KeyboardArrowLeft/>}
                                                    rightArrowIcon={<KeyboardArrowRight/>}
                                                    disableFuture
                                                    label="Start Date"
                                                    maxDate={endDate}
                                                    value={startDate}
                                                    onChange={this.handleStartDateChange}
                                                    style={{margin: '1rem'}}
                                                />
                                                <DatePicker
                                                    leftArrowIcon={<KeyboardArrowLeft/>}
                                                    rightArrowIcon={<KeyboardArrowRight/>}
                                                    disableFuture
                                                    label="End Date"
                                                    minDate={startDate}
                                                    value={endDate}
                                                    onChange={this.handleEndDateChange}
                                                    style={{margin: '1rem'}}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Grid>
                                        <Grid item style={{display: 'flex'}} xs={12} sm={12} md={12} lg={12}>
                                            <FormControl style={{margin: '1rem', width: '100%'}}>
                                                <InputLabel htmlFor="select-multiple-checkbox">Months</InputLabel>
                                                <Select
                                                    multiple
                                                    value={this.state.months}
                                                    onChange={this.handleMonthsChange}
                                                    input={<Input id="select-multiple-checkbox" />}
                                                    renderValue={selected => selected.join(', ')}
                                                >
                                                    {this.state.availableMonths.map(name => (
                                                        <MenuItem key={name} value={name}>
                                                            <Checkbox checked={this.state.months.indexOf(name) > -1} />
                                                            <ListItemText primary={name} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item style={{display: 'flex'}} xs={12} sm={12} md={12} lg={12}>
                                            <FormControl style={{margin: '1rem', width: '100%'}}>
                                                <InputLabel htmlFor="select-multiple-checkbox">Days of the Week</InputLabel>
                                                <Select
                                                    multiple
                                                    value={this.state.daysOfTheWeek}
                                                    onChange={this.handleDaysOfTheWeekChange}
                                                    input={<Input id="select-multiple-checkbox" />}
                                                    renderValue={selected => selected.join(', ')}
                                                >
                                                    {this.state.availableDaysOfTheWeek.map(name => (
                                                        <MenuItem key={name} value={name}>
                                                            <Checkbox checked={this.state.daysOfTheWeek.indexOf(name) > -1} />
                                                            <ListItemText primary={name} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Button variant="contained" onClick={this.getResponseData}>Submit</Button>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid item style={{height: '80%'}} xs={12} sm={12} md={this.state.open ? 7 : 12} lg={this.state.open ? 7 : 12}>
                                <Typography style={{display: Object.keys(this.state.data).length > 0 ? 'block' : 'none'}} variant="title" color="textPrimary" align={'center'} gutterBottom>
                                    {'Responses for ' + moment(startDate).format('L') + (!moment(startDate).isSame(endDate) ? (' - ' + moment(this.state.endDate).format('L') ) : '') }
                                </Typography>
                                <Typography style={{display: Object.keys(this.state.data).length > 0 ? 'none' : 'block'}} variant="title" color="textPrimary" align={'center'} gutterBottom>
                                    {'No data found for dates ' + moment(startDate).format('L') + (!moment(startDate).isSame(endDate) ? (' - ' + moment(this.state.endDate).format('L') ) : '') }
                                </Typography>
                                <VictoryChart
                                // adding the material theme provided with Victory
                                theme={VictoryTheme.material}
                                domainPadding={20}
                                style={{parent: {display: Object.keys(this.state.data).length > 0 ? 'block' : 'none'}}}
                                >
                                    <VictoryAxis
                                        style={{
                                            axisLabel: { padding: 40 },
                                        }}
                                        label="Time"
                                    />
                                    <VictoryAxis
                                        style={{
                                            axisLabel: { padding: 40 }
                                        }}
                                        dependentAxis
                                        tickValues={[1, 2, 3, 4, 5, 6 , 7, 8, 9, 10]}
                                        label="Rating"
                                    />
                                    <VictoryBar
                                        data={this.state.graphData.Data}
                                        labels={(d) => d.Response}
                                        style={{ labels: { fill: "white" } }}
                                        labelComponent={<VictoryLabel dy={30}/>}
                                        x="Time"
                                        y="Response"
                                    />
                                </VictoryChart>
                            </Grid>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Router>  
        )
        }
    }
  }
const analyticsWrapped = withStyles(styles)(Analytics);
const analyticsWrappedWithRouter = withRouter(analyticsWrapped)
export default analyticsWrappedWithRouter;
