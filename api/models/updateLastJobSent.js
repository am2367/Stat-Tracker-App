const mongoConnection = require('../models/mongoConnection.js');

const updateLastJobSent = (username, jobName, index, callback) => {
    mongoConnection(function(dbo, closeDb){

        dbo.collection("Configs").updateOne({Username: username}, 
            {$set: 
                {LastJobSent: {JobName: jobName, QuestionIndex: index}}}, 
            {upsert: true}, 
            function(err, res) {
                if (err) throw err;
                callback("Last job sent entry in database for user " + username + " updated to: " + jobName + " question index " + index)
            }
        );

        closeDb()
    });

}

module.exports = updateLastJobSent;
