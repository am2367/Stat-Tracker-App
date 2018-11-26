const mongoConnection = require('../models/mongoConnection.js');
const moment = require('moment')

const getResponseData = (username, req, callback) => {

    mongoConnection(function(dbo, closeDb){
        var query = {$and: 
                        [{Date:
                            {$gte: moment(req.startDate).format('L'), 
                              $lte: moment(req.endDate[0]).format('L') } 
                            }, 
                            {Username: username}
                        ]};

        dbo.collection("Responses").find(query).toArray(function myFunc(err, result) {
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

module.exports = getResponseData;
