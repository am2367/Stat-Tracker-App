var schedule = require('node-schedule');
const sendText = require('../models/sendText.js');
const sendEmail = require('../models/sendEmail.js');
const createResponseObjectInDb = require('../models/createResponseObjectInDb.js');
const updateLastJobSent = require('../models/updateLastJobSent.js');
const addJobToDb = require('../models/addJobToDb.js');

const createNotificationSchedule = (username, data, callback) => {

    var rule = new schedule.RecurrenceRule();
    const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let days = []
    
    Object.values(data.notificationData.onDays).reduce((index, day) => {
        days.push(dayIndex.indexOf(day))
    }, [])
    
    rule.dayOfWeek = days

    if(data.notificationData.messageTimeType === 'Every'){
        if(data.notificationData.everyMinutes > 0){
            rule.minute = [new schedule.Range(0, 59, data.notificationData.everyMinutes)];
        }else{
            rule.minute = 0
        }

        if(data.notificationData.everyHours > 0){
            rule.hour = [new schedule.Range(0, 23, data.notificationData.everyHours)];
        }else{
            rule.hour = [new schedule.Range(0, 23)]
        }
    }else{
        rule.minute = parseInt(data.notificationData.atTime.split(':')[1])
        rule.hour =  parseInt(data.notificationData.atTime.split(':')[0])
    }
    
    const jobName = username + "_" + data.configName
    
    if(data.questionData[1].type === 'yes/no'){
        var question = data.questionData[1].question + ' (' + data.questionData[1].type + ')';
    }else{
        var question = data.questionData[1].question + ' (On a scale of 1-' + data.questionData[1].type + ')';
    }
    
    if(data.notificationData.notificationType === 'Text'){
        var j = schedule.scheduleJob(jobName, rule, function(){
            sendText(username, question, function(response){
                console.log(response)

                updateLastJobSent(username, jobName, 1, function(response){
                    console.log(response)
                })

                console.log('Next job set to run at ' + j.nextInvocation())
            })
        });

        addJobToDb(username, jobName, data.notificationData, question, 'Text', function(response){
            console.log(response)
        })

        console.log('Next job set to run at ' + j.nextInvocation())
    }else{
        var j = schedule.scheduleJob(jobName, rule, function(){
            sendEmail(username, question, function(response){
                console.log(response)
                console.log('Next job set to run at ' + j.nextInvocation())
            })
        });

        addJobToDb(username, jobName, data.notificationData, question, 'Email', function(response){
            console.log(response)
        })

        console.log('Next job set to run at ' + j.nextInvocation())
    }

    createResponseObject(username, jobName, data.questionData)

    callback('Activated! Next job set to run at: ' + j.nextInvocation())
}

function createResponseObject(username, jobName, questionData){

    let questions = {}

    Object.keys(questionData).reduce((index, questionIndex) => {
        questions[questionIndex] = {Response: "", ResponseTime: ""}
    }, [])

    createResponseObjectInDb(username, jobName, questions, function(result){
        console.log(result)
    });
}

module.exports = createNotificationSchedule;
