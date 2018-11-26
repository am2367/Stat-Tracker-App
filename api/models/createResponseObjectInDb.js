const mongoConnection = require('../models/mongoConnection.js');
const moment = require('moment');

const createResponseObjectInDb = (username, jobName, questions, callback) => {
    const date = moment().format('L');

    mongoConnection(function(dbo, closeDb){
        dbo.collection("Responses").updateOne({Username: username, JobName: jobName, Date: date}, 
            {$set: 
                {
                    ['Occurrence.' + 1 + '.QuestionIndex'] : questions, 
                    ['OccurrenceCount'] : 1
                }
            },
            {upsert: true}, 
            function(err, res) {
                if (err) throw err;
                callback('Response object for job ' + jobName + ' added to DB')
                closeDb()
            }
        );
    });

}

module.exports = createResponseObjectInDb;
