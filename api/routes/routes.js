const express = require('express');
const router = express.Router();
const validateCreds = require('../models/validateCreds.js');
const register = require('../models/register.js');
const path = require('path');
const moment =  require('moment');
const checkSession = require('../models/checkSession.js');
const validateFields = require('../models/validateFields.js');
const sendText = require('../models/sendText.js');
const handleTextReply = require('../models/handleTextReply.js');
const updateConfig = require('../models/updateConfig.js');
const createDefaultConfigs = require('../models/createDefaultConfigs.js');
const getUserData = require('../models/getUserData.js');
const getResponseData = require('../models/getResponseData.js');
const getResponseDates = require('../models/getResponseDates.js');
const createNotificationSchedule = require('../models/createNotificationSchedule.js');
const cancelNotificationSchedule = require('../models/cancelNotificationSchedule.js');
var schedule = require('node-schedule');
const deleteConfiguration = require('../models/deleteConfiguration.js');

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

//Handle text reply
router.post('/api/handleTextReply', (req, res) => {
    //console.log(req.body)
    handleTextReply(req.body, function(result){
        console.log(result)
    });

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

//get next notification time
router.get('/api/config/getNextNotificationTime', (req, res) => {
    if(checkSession(req)){
        const jobName = req.session.username + "_" + req.query.configName
        
        try{
            var my_job = schedule.scheduledJobs[jobName];
            res.json(my_job.nextInvocation());
        }
        catch(err){
            res.json('Error')
        }
    }
});

//get user data
router.get('/api/config/getData', (req, res) => {
    //console.log(req.query)
    if(checkSession(req)){
        getUserData(req.session.username, function(result){
            res.json(result)
        });
    }
});

//Delete configuration
router.get('/api/config/delete', (req, res) => {
    console.log(req.query)
    if(checkSession(req)){
        deleteConfiguration(req.session.username, req.query.configName, function(result){
            //console.log(result)
            if(result === 'Deleted'){
                cancelNotificationSchedule(req.session.username, req.query, function(result){
                    res.json('Deleted')
                })
            }
            else{
                res.json('Error')
            }
        })
    }
});


//Get response data
router.get('/api/responses/getData', (req, res) => {
    console.log(req.query)
    if(checkSession(req)){
        getResponseData(req.session.username, req.query, function(result){
            res.json(result)
        });
    }
});

//Get response dates
router.get('/api/responses/getDates', (req, res) => {
    //console.log(req.query)
    if(checkSession(req)){
        getResponseDates(req.session.username, function(result){
            res.json(result)
        });
    }
});

//update the configuration
router.post('/api/config/update', (req, res) => {
    console.log(req.body)
    if(checkSession(req)){
        updateConfig(req.session.username, req.body, function(result){
            //console.log(result)
            if(result === 'Updated'){
                res.json('Updated')
            }
            else{
                res.json('Error')
            }
        })
    }
});

//activate the configuration
router.post('/api/config/activate', (req, res) => {
    console.log(req.body)
    if(checkSession(req)){
        updateConfig(req.session.username, req.body, function(result){
            //console.log(result)
            if(result === 'Updated'){
                createNotificationSchedule(req.session.username, req.body, function(result){
                    res.json(result)
                })
            }
            else{
                res.json('Error')
            }
        })
    }
});

//deactivate the configuration
router.post('/api/config/deactivate', (req, res) => {
    console.log(req.body)
    if(checkSession(req)){
        updateConfig(req.session.username, req.body, function(result){
            //console.log(result)
            if(result === 'Updated'){
                cancelNotificationSchedule(req.session.username, req.body, function(result){
                    res.json('Updated')
                })
            }
            else{
                res.json('Error')
            }
        })
    }
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