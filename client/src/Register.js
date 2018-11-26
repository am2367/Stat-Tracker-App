import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Info from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import { withRouter } from 'react-router-dom';
import MaskedInput from 'react-text-mask';


const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      width: '100%',
      marginTop: 20
    },
    inputLabelFocused: {
      color: 'blue',
    },
    textFieldRoot: {
      padding: 0,
      'label + &': {
        marginTop: theme.spacing.unit * 3,
      },
    },
    textFieldInput: {
      borderRadius: 4,
      backgroundColor: theme.palette.common.white,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 12px',
      width: 'calc(100% - 24px)',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:focus': {
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
    textFieldFormLabel: {
      fontSize: 18,
    }
  });

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
        {...other}
        ref={inputRef}
        mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        placeholderChar={'\u2000'}
        showMask
        />
    );
}

TextMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
};

class Register extends React.Component {
    state = {
        showPassword: false,
        first_nameError: false,
        last_nameError: false,
        emailError: false,
        phoneError: false,
        usernameError: false,
        passwordError: false,
        confirmPasswordError: false,
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        phone: '(   )    -    '
      }
    
    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    handleClickShowPasssword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    
    login = () => {
        this.props.history.push('/Login')
    }

    handleRegister = (event) => {
        event.preventDefault();
        var data = this.validation();

        if(data == false){
            return;
        }

        fetch('/api/register', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data=>{
            if(data === "Registered"){
                alert("Registered!");
                this.props.history.push('/Login')
            }
            else if(data === "Username Taken"){
                alert("Username Taken")
            }
            else if(data === "Email Taken"){
                alert("Email Taken")
            }
            else {
                alert("Error!");
            }
        })
    }

    validation = () => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let error = false;
        this.setState({first_nameError: false, last_nameError: false, emailError: false, phoneError: false, passwordError: false, usernameError: false, confirmPasswordError: false})        
        if(this.state.firstName === ''){
            this.setState({first_nameError: true})
            error = true;
        }

        if(this.state.lastName === ''){
            this.setState({last_nameError: true})
            error = true;
        }

        if(this.state.username === ''){
            this.setState({usernameError: true})
            error = true;
        }
        
        if(!this.isOkPass(this.state.password)){
            this.setState({passwordError: true})
            error = true;
        }

        if(this.state.password != this.state.confirmPassword){
            this.setState({confirmPasswordError: true})
            error = true;
        }

        if(this.state.email === '' || !re.test(String(this.state.email).toLowerCase())){
            this.setState({emailError: true})
            error = true;
        }

        if(this.state.phone.replace(/\s/g,'').length !== 13){
            this.setState({phoneError: true})
            error = true;
        }else{
            var phone = Object.assign(this.state.phone)
            phone = '+1' + phone.replace(/\D/g,'');
        }

        var data = {firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    phone: phone,
                    username: this.state.username,
                    password: this.state.password};
        if(error){
            return false
        }

        return data;
    }

    isOkPass(p){
        var anUpperCase = /[A-Z]/;
        var aLowerCase = /[a-z]/;
        var aNumber = /\d/;
        var aSpecial = /[!|@|#|$|%|^|&|*|(|)|-|_]/;
        if( (p.length < 8)  || !anUpperCase.test(p) || !aLowerCase.test(p) || !aNumber.test(p) || !aSpecial.test(p) ){
            return false;
        }
        else {
            return true;
        }
    }

    render() {
        const { classes } = this.props;
        

        return(
            <div style={{textAlign: 'center'}}>
                <Grid item  xs={10} sm={8} md={4} lg={4} style={{textAlign: 'center', margin: 'auto', display: 'flex'}}>
                    <Card>
                        <CardHeader title="Register"/>
                        <form style={{marginLeft: 10, marginBottom: 10, marginRight: 10}} id="form" className="form" onSubmit={this.handleRegister}>
                            
                            <TextField
                                style={{width: '42.5%', marginTop: '2%'}}
                                label="First Name"
                                id="first_name" 
                                value={this.state.first_name}
                                onChange={this.handleChange('firstName')}
                                variant="outlined"
                                error={this.state.first_nameError ? true : false}
                            />

                            <TextField
                                style={{width: '42.5%', marginTop: '2%'}}
                                label="Last Name"
                                id="last_name" 
                                value={this.state.last_name}
                                onChange={this.handleChange('lastName')}
                                variant="outlined"
                                error={this.state.last_nameError ? true : false}
                            />

                            <TextField
                                style={{width: '85%', marginTop: '2%'}}
                                label="Email"
                                id="email" 
                                value={this.state.email}
                                onChange={this.handleChange('email')}
                                variant="outlined"
                                error={this.state.emailError ? true : false}
                            />

                            <TextField
                                style={{width: '85%', marginTop: '2%'}}
                                value={this.state.phone}
                                onChange={this.handleChange('phone')}
                                id="formatted-text-mask-input"
                                variant="outlined"
                                InputProps={{
                                    inputComponent: TextMaskCustom,
                                    value: this.state.phone,
                                    onChange: this.handleChange('phone'),
                                  }}
                                error={this.state.phoneError ? true : false}
                            />

                            <TextField
                                style={{width: '85%', marginTop: '2%'}}
                                label="Username"
                                id="username" 
                                value={this.state.username}
                                onChange={this.handleChange('username')}
                                variant="outlined"
                                error={this.state.usernameError ? true : false}
                            />

                            <TextField
                                style={{width: '85%', marginTop: '2%'}}
                                id="registerPassword"
                                label="Password"
                                error={this.state.passwordError ? true : false}
                                type={this.state.showPassword ? 'text' : 'password'}
                                value={this.state.password}
                                onChange={this.handleChange('password')}
                                variant="outlined"
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                        <IconButton
                                            onClick={this.handleClickShowPasssword}
                                            onMouseDown={this.handleMouseDownPassword}
                                        >
                                            {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                        <Tooltip
                                        id="tooltip-controlled"
                                        title="Password needs to be at least 8 characters long and must contain an upper case, lower case, number, and special character."
                                        onClose={this.handleTooltipClose}
                                        enterDelay={200}
                                        leaveDelay={200}
                                        onOpen={this.handleTooltipOpen}
                                        open={this.state.tooltipOpen}
                                        placement="top"
                                        >
                                        <IconButton aria-label="Delete">
                                            <Info />
                                        </IconButton>
                                        </Tooltip>
                                        </InputAdornment>
                                }}
                            />

                            <TextField
                                style={{width: '85%', marginTop: '2%'}}
                                id="confirmPassword"
                                label="Confirm Password"
                                error={this.state.confirmPasswordError ? true : false}
                                type={this.state.showPassword ? 'text' : 'password'}
                                value={this.state.confirmPassword}
                                onChange={this.handleChange('confirmPassword')}
                                variant="outlined"
                                InputProps={{
                                    endAdornment:
                                    <InputAdornment position="end">
                                    <IconButton
                                        onClick={this.handleClickShowPasssword}
                                        onMouseDown={this.handleMouseDownPassword}
                                    >
                                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                    </InputAdornment>
                                }}
                            />

                            <FormControl className={classes.formControl}>
                                <div style={{textAlign: "center"}}>
                                    <Button id="register" className={classes.button} type="submit" style={{width: '33%',color: 'white', backgroundColor: '#3f51b5', marginRight: '1%'}}>
                                        Register
                                    </Button>
                                    <Button id='login' className={classes.button} onClick={this.login} style={{width: '33%',color: 'white', backgroundColor: '#3f51b5'}}>
                                        Login
                                    </Button>
                                </div>
                            </FormControl>
                        </form>
                    </Card>
                </Grid>
            </div>
        )
    }
}
  
const RegisterWrapped = withStyles(styles)(Register);
const registerWrappedWithRouter = withRouter(RegisterWrapped)
export default registerWrappedWithRouter;