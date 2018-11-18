const express = require('express');
const router = express.Router();
const validateCreds = require('../models/validateCreds.js');
const register = require('../models/register.js');
const path = require('path');
const moment =  require('moment');
const checkSession = require('../models/checkSession.js');
const validateFields = require('../models/validateFields.js');
const sendText = require('../models/sendText.js');
const updateConfig = require('../models/updateConfig.js');
const createDefaultConfigs = require('../models/createDefaultConfigs.js');
const getUserData = require('../models/getUserData.js');

//login
router.post('/api/login', (req, res) => {
    //console.log(req.body)
    if(validateFields(req)){
        validateCreds(req.body, function(result){
            //console.log(result)
            if(result == 'Correct'){
                req.session.username = req.body.username;
                req.session.save;
                res.json('Correct')
            }
            else{
                res.json('Incorrect')
            }
        })
    }
    else{
        res.json('Incorrect')        
    }
});

//logout
router.get('/api/logout', (req, res) => {
    //console.log(req.query)
    req.session.username = null
    res.json('Logged Out')
});

//check session
router.get('/api/checkSession', (req, res) => {
    //console.log('Check Session')
    if(checkSession(req)){
        res.json('Active')
    }
    else{
        res.json('Inactive')
    }
});

//get username
router.get('/api/getUsername', (req, res) => {
    //console.log(req.query)
    if(checkSession(req)){
        res.json(req.session.username)
    }
});

//Send text
router.get('/api/sendText', (req, res) => {
    //console.log(req.query)
    if(checkSession(req)){
        sendText(req.session.username, function(result){
            res.json(result)
        });
    }
});

//Send text
router.get('/api/getUserData', (req, res) => {
    //console.log(req.query)
    if(checkSession(req)){
        getUserData(req.session.username, function(result){
            res.json(result)
        });
    }
});

//register
router.post('/api/register', (req, res) => {
    console.log(req.body)
    if(validateFields(req)){

        register(req.body, function(result){
            //console.log(result)
            if(result === 'Registered'){
                req.session.username = req.body.username;
                req.session.save;
                
                createDefaultConfigs(req.session.username, function(result){
                    if(result === 'Created'){
                        res.json('Registered')
                    }
                })
            }
            else if(result === "Username Taken"){
                res.json("Username Taken");
            }
            else if(result === "Email Taken"){
                res.json("Email Taken");
            }
            else{
                res.json('Error')
            }
        })
    }
    else{
        res.json('Error')
    }
});

//update the configuration
router.post('/api/updateConfig', (req, res) => {
    console.log(req.body)
    updateConfig(req.session.username, req.body, function(result){
        //console.log(result)
        if(result === 'Updated'){
            res.json('Updated')
        }
        else{
            res.json('Error')
        }
    })
});

//activate the configuration
router.post('/api/activateConfig', (req, res) => {
    console.log(req.body)
    updateConfig(req.session.username, req.body, function(result){
        //console.log(result)
        if(result === 'Updated'){
            res.json('Updated')
        }
        else{
            res.json('Error')
        }
    })
});

//if production > serve static files
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    router.use(express.static(path.join(__dirname, '../../client/build')));
    // Handle React routing, return all requests to React app
    router.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
    });
};

module.exports = router;