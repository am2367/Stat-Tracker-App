const mongoConnection = require('../models/mongoConnection.js');

const addJobToDb = (username, jobName, notificationData, question, messageType, callback) => {
    mongoConnection(function(dbo, closeDb){

        const query = {Username: username, JobName: jobName, NotificationData: notificationData, Question: question, MessageType: messageType}

        dbo.collection("Jobs").insertOne(query, function(err, res) {
            if (err) throw err;
            callback('Job added to db')
        });
        closeDb()
    });

}

module.exports = addJobToDb;
