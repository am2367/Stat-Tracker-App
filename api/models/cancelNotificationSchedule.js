var schedule = require('node-schedule');
const mongoConnection = require('../models/mongoConnection.js');

const cancelNotificationSchedule = (username, data, callback) => {

    const jobName = username + "_" + data.configName

    var my_job = schedule.scheduledJobs[jobName];
    try{
        my_job.cancel();
        console.log('Job ' + jobName + ' has been canceled')
    }
    catch(err){
        console.log('Job ' + jobName + ' does not exist and could not be canceled')
    }

    mongoConnection(function(dbo, closeDb){

        const query = {JobName: jobName}

        dbo.collection("Jobs").deleteOne(query, function(err, res) {
            if (err) throw err;
            callback('Job deleted from DB')
        });
        closeDb()
    });    
}

module.exports = cancelNotificationSchedule;
