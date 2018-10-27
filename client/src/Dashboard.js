import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import checkSession from './CheckSession.js';
import TopNav from "./TopNav.js";
import Panel from "./Panel.js";

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%'
  },
  Card: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  viewButtons: {
    backgroundColor: '#14e4ff',
    borderRadius: 0,
    borderRight: '1px solid #3f51b5',
    padding: '0'
  },
  viewLinks: {
    display: 'block', 
    height: '100%', 
    width: '100%', 
    textDecoration: 'none'
  }
});

class Dashboard extends React.Component {
  state = {loggedIn: false, data: {}}

  componentWillMount = () => {
    let thisRef = this
    checkSession(function(result){
      if(result === false){
        thisRef.redirect()
      }
      else{
          thisRef.getUsername();
          //thisRef.sendText();
      }
    })
      
  }

  sendText = () => {
    fetch('/api/sendText')
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        
    })
  }

  getUsername = () => {
    fetch('/api/getUsername')
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if(data){
            //console.log(data)
            this.setState({username: data})
        }else{
            this.props.history.push('/Login');
            alert('Ran into an error, please login again.')
        }
    })
  }

  


  redirect = () => {
    this.props.history.push('/Login');
  }

  render(){
    const { classes } = this.props;

    return (
      <Router>
        <div className={classes.root}>
          <TopNav username={this.state.username}/>
          <Panel/>
        </div>
      </Router>  
      )
    }
  }
const dashboardWrapped = withStyles(styles)(Dashboard);
const dashboardWrappedWithRouter = withRouter(dashboardWrapped)
export default dashboardWrappedWithRouter;
