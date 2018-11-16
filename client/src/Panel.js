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

class Panel extends React.Component {
  state = {active: [], 
           inactive: [], 
           configOpen: false,
           configName: '',
           data: {}}

  componentWillMount = () => {
    let thisRef = this
    checkSession(function(result){
      if(result === false){
        thisRef.redirect()
      }else{
        thisRef.getUserData()
      }
    })
      
  }

  getUserData = () => {
    fetch('/api/getUserData')
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if(data){
            let configs = data.Configurations
            let active = []
            let inactive = []
            Object.keys(configs).reduce((index, config) => {
              if(configs[config].active === true){
                active.push(config)
              }else{
                inactive.push(config)
              }
            }, [])
            console.log(active)
          this.setState({data: data, inactive: inactive, active: active})
        }else{
            console.log(data)
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
    this.setState({configOpen: true, configName: "New Configuration"})
  }

  redirect = () => {
    this.props.history.push('/Login');
  }
  
  render(){
    const { classes } = this.props;

    const inactiveButtons = this.state.inactive.map((item) => <Button className={classes.buttons} variant="contained" onClick={() => { this.handleOpen({item}) }}> {item}</Button>)
    inactiveButtons.push(<Button className={classes.addButton} variant="contained" onClick={() => { this.newConfig() }}><AddIcon /></Button>)
    const activeButtons = this.state.active.map((item) => <Button className={classes.buttons} variant="contained"  onClick={() => { this.handleOpen({item}) }}>{item}</Button>)

    return (
      <Router>
        <Grid container xs={10} sm={10} md={10} lg={10} spacing={24} style={{margin: 'auto',  marginTop: '2rem', height: '80%' }}>
            <Grid item  xs={10} sm={8} md={6} lg={6} style={{height: '100%'}}>
                <Card style={{height: '100%', width:'100%'}}>
                    <CardHeader style={{textAlign: 'center'}} title="Active"/>
                    <Grid item  xs={10} sm={10} md={10} lg={10} style={{margin: 'auto', height: '75%'}}>
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
              configName={this.state.configName}/>
              :
              ''
            }
        </Grid>
      </Router>  
      )
    }
  }
const panelWrapped = withStyles(styles)(Panel);
const panelWrappedWithRouter = withRouter(panelWrapped)
export default panelWrappedWithRouter;
