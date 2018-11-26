const mongoConnection = require('../models/mongoConnection.js');
const moment = require('moment')

const getResponseDates = (username, callback) => {

    mongoConnection(function(dbo, closeDb){
        var query = {Username: username}
                        

        dbo.collection("Responses").find(query).project({Date:1, _id: 0}).toArray(function myFunc(err, result) {
            if (err) throw err;
            if(result.length){
                //console.log(result)
                callback(result);
            }
            else{
                callback('Empty')
            }
            closeDb()
        });
    });
}

module.exports = getResponseDates;
