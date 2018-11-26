const mongoConnection = require('../models/mongoConnection.js');
const moment = require('moment');

const updateResponse = (username, jobName, index, response, callback) => {
    const date = moment().format('L');
    const time = moment().format('LT');

    mongoConnection(function(dbo, closeDb){

        dbo.collection("Responses").findOne({Username: username, JobName: jobName, Date: date}, {OccurrenceCount : 1, _id: 0}, function(err, result){
            let count = result.OccurrenceCount

            dbo.collection("Responses").updateOne({Username: username, JobName: jobName}, 
                {$set: 
                    {
                    ['Occurrence.' + parseInt(count) + '.QuestionIndex.' + index + '.Response']: response,
                    ['Occurrence.' + parseInt(count) + '.QuestionIndex.' + index + '.ResponseTime']: time
                    }
                }, 
                {upsert: true}, 
                function(err, res) {
                    if (err) throw err;
                    callback("Response " + response + " added for username " + username + " job name " + jobName + " question index " + index + " occurrence " + count)
                    closeDb()

                }
            );
        })
    });
}

module.exports = updateResponse;
