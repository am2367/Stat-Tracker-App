import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import checkSession from './CheckSession.js';
import ConfigModal from './ConfigModal.js';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  Card: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  buttons: {
    margin: '0.5rem'
  },
  inactiveButtons: {
    margin: '0.5rem'
  },
  activeButtons: {
    margin: '0.5rem',
    backgroundColor: '#a4ddff'
  },
  addButton: {
    margin: '0.5rem',
    backgroundColor: '#8dd18d'
  },
  viewLinks: {
    display: 'block', 
    height: '100%', 
    width: '100%', 
    textDecoration: 'none'
  }
});

class Configurations extends React.Component {
  state = {active: [], 
           inactive: [], 
           configOpen: false,
           configName: '',
           data: this.props.data}
  
  updateConfigs = () => {
    let configs = this.state.data.Configurations
    let active = []
    let inactive = []
    Object.keys(configs).reduce((index, config) => {
      if(configs[config].active === true && configs[config].configName !== 'New Configuration'){
        active.push(config)
      }else if(configs[config].configName !== 'New Configuration'){
        inactive.push(config)
      }
    }, [])

    this.setState({inactive: inactive, active: active})
  }
  
  componentWillMount = () => {
    let thisRef = this
    checkSession(function(result){
      if(result === false){
        thisRef.redirect()
      }else{
        if(Object.keys(thisRef.props.data).length !== 0 ){
          thisRef.setState({data: thisRef.props.data}, () => {
            thisRef.updateConfigs()
          })
        }
      }
    })
  }

  componentWillReceiveProps = (nextProps) => {
    if(Object.keys(nextProps.data).length !== 0){
      this.setState({data: nextProps.data}, () => {
        this.updateConfigs()
      })
    }
  }

  getUserData = () => {
    this.props.getUserData()
  }

  deleteConfiguration = (configName) => {
    fetch('/api/config/delete?configName=' + configName)
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if('Deleted'){
            //console.log(data)
            this.getUserData()
        }else{
            console.log('Was not able to delete')
        }
    })
  }

  handleClose = (item) => {
    this.setState({configOpen: false, configName: ''})
  }

  handleOpen = (item) => {
    let itemName = item['item']
    this.setState({configOpen: true, configName: itemName})
  }

  newConfig = () => {
    this.setState({configOpen: true, configName: 'New Configuration'})
  }

  redirect = () => {
    this.props.history.push('/Login');
  }

  validateNewConfigName = (newConfigName) => {

    console.log("New Config Name: " + newConfigName)
    if(newConfigName === "New Configuration"){
      return "New Configuration is taken by the system and cannot be used as your configuration name"
    }
    else if(Object.keys(this.state.data.Configurations).includes(newConfigName) && this.state.configName !== newConfigName){
      return "This configuration name is already in use"
    }
    else if(newConfigName.trim() === ''){
      return "Configuration name cannot be empty"
    }else{
      return true
    }
  }
  
  render(){
    const { classes } = this.props;

    const inactiveButtons = this.state.inactive.map((item) => <Button className={classes.inactiveButtons} variant="contained" onClick={() => { this.handleOpen({item}) }}> {item}</Button>)
    inactiveButtons.push(<Button className={classes.addButton} variant="contained" onClick={() => { this.newConfig() }}><AddIcon /></Button>)
    const activeButtons = this.state.active.map((item) => <Button className={classes.activeButtons} variant="contained"  onClick={() => { this.handleOpen({item}) }}>{item}</Button>)

    if(this.props.hidden){
      return('')
    } 
    else{
      return (  
        <Router> 
          <Grid container xs={11} sm={11} md={11} lg={11} spacing={24} style={{margin: 'auto',  marginTop: '1rem', height: '80%' }}>
              <Grid item  xs={10} sm={8} md={6} lg={6} style={{height: '100%'}}>
                  <Card style={{height: '100%', width:'100%'}}>
                      <CardHeader style={{textAlign: 'center'}} title="Active"/>
                      <Grid item  xs={10} sm={10} md={10} lg={10} style={{margin: 'auto'}}>
                          {activeButtons}
                      </Grid>
                  </Card>
              </Grid>

              <Grid item  xs={10} sm={8} md={6} lg={6} style={{height: '100%'}}>
                  <Card style={{height: '100%', width:'100%'}}>
                      <CardHeader style={{textAlign: 'center'}} title="Inactive"/>
                          <Grid item  xs={10} sm={10} md={10} lg={10} style={{margin: 'auto', height: '75%'}}>
                              {inactiveButtons}
                          </Grid>
                  </Card>
              </Grid>
              {Object.keys(this.state.data).length !== 0 && this.state.configName !== ''
              ?
              <ConfigModal 
                open={this.state.configOpen} 
                data={this.state.data.Configurations[this.state.configName]}
                onClose={this.handleClose} 
                configName={this.state.configName}
                validateNewConfigName={this.validateNewConfigName}
                refreshData={this.getUserData}
                deleteConfiguration={this.deleteConfiguration}
              />
              :
                ''
              }
          </Grid>
        </Router>  
        )
      }
    }
  }
const configurationsWrapped = withStyles(styles)(Configurations);
const configurationsWrappedWithRouter = withRouter(configurationsWrapped)
export default configurationsWrappedWithRouter;
