import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import checkSession from './CheckSession.js';
import TopNav from "./TopNav.js";
import Configurations from "./Configurations.js";
import Analytics from "./Analytics.js";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

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


function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class Dashboard extends React.Component {
  state = {loggedIn: false, data: {}, value: 0}

  componentWillMount = () => {
    let thisRef = this
    checkSession(function(result){
      if(result === false){
        thisRef.redirect()
      }else{
        thisRef.getUsername();
        thisRef.getUserData()
      }
    })
      
  }

  getUserData = () => {
    fetch('/api/config/getData')
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if(data){
          this.setState({data: data})
        }else{
            console.log(data)
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

  handleTabChange = (event, value) => {
    this.setState({ value });
  };


  redirect = () => {
    this.props.history.push('/Login');
  }

  render(){
    const { classes } = this.props;

    return (
      <Router>
        <div className={classes.root}>
          <TopNav redirect={this.redirect} username={this.state.username}/>
          <Tabs
            value={this.state.value}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Analytics" />
            <Tab label="Configurations" />
          </Tabs>
          <Analytics hidden={this.state.value === 1}/>
          <Configurations hidden={this.state.value === 0} getUserData={this.getUserData} data={this.state.data}/>
        </div>
      </Router>  
      )
    }
  }
const dashboardWrapped = withStyles(styles)(Dashboard);
const dashboardWrappedWithRouter = withRouter(dashboardWrapped)
export default dashboardWrappedWithRouter;
