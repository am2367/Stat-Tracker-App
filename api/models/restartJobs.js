const mongoConnection = require('../models/mongoConnection.js');
var schedule = require('node-schedule');
const sendText = require('../models/sendText.js');
const sendEmail = require('../models/sendEmail.js');
const updateLastJobSent = require('../models/updateLastJobSent.js');

const restartJobs = (callback) => {
    
    mongoConnection(function(dbo, closeDb){

        dbo.collection("Jobs").find({}, function(err, res) {
            if (err) throw err;

            restartJobSchedules(res, callback)

        });
        closeDb()
    });

}

function restartJobSchedules(data, callback){
    
    data.forEach(function(job){
        var rule = new schedule.RecurrenceRule();
        const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        let days = []
        
        Object.values(job.NotificationData.onDays).reduce((index, day) => {
            days.push(dayIndex.indexOf(day))
        }, [])
        
        rule.dayOfWeek = days

        if(job.NotificationData.messageTimeType === 'Every'){
            if(job.NotificationData.everyMinutes > 0){
                rule.minute = [new schedule.Range(0, 59, job.NotificationData.everyMinutes)];
            }else{
                rule.minute = 0
            }

            if(job.NotificationData.everyHours > 0){
                rule.hour = [new schedule.Range(0, 23, job.NotificationData.everyHours)];
            }else{
                rule.hour = [new schedule.Range(0, 23)]
            }
        }else{
            rule.minute = parseInt(job.NotificationData.atTime.split(':')[1])
            rule.hour =  parseInt(job.NotificationData.atTime.split(':')[0])
        }

        if(job.MessageType === 'Text'){
            var j = schedule.scheduleJob(job.JobName, rule, function(){
                sendText(job.Username, job.Question, function(response){
                    console.log(response)
    
                    updateLastJobSent(job.Username, job.JobName, 1, function(response){
                        console.log(response)
                    })
    
                    console.log('Next job set to run at ' + j.nextInvocation())
                })
            });
    
            console.log('Next job set to run at ' + j.nextInvocation())
        }else{
            var j = schedule.scheduleJob(rule, function(){
                sendEmail(job.Username, job.Question, function(response){
                    console.log(response)
                    console.log('Next job set to run at ' + j.nextInvocation())
                })
            });
            console.log('Next job set to run at ' + j.nextInvocation())
        }
    })

    callback('All jobs have been restarted')

}

module.exports = restartJobs;
