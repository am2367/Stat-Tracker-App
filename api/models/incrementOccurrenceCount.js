const mongoConnection = require('../models/mongoConnection.js');
const moment = require('moment');

const incrementOccurrenceCount = (username, jobName, callback) => {
    const date = moment().format('L');

    mongoConnection(function(dbo, closeDb){
        dbo.collection("Responses").updateOne({Username: username, JobName: jobName, Date: date}, 
            {$inc: {OccurrenceCount : 1}},
            {upsert: true}, 
            function(err, res) {
                if (err) throw err;
                callback('Occurence count for ' + jobName + ' date ' + date + ' incremented')
            }
        );
        
    });

}

module.exports = incrementOccurrenceCount;
