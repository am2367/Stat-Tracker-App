const mongoConnection = require('../models/mongoConnection.js');

const getUserData = (username,callback) => {

    mongoConnection(function(dbo, closeDb){

        var query = {Configurations : {'$exists' : 1}, Username: username};

        dbo.collection("Configs").find(query).toArray(function myFunc(err, result) {
            if (err) throw err;
            if(result.length){
                callback(result[0]);
            }
            else{
                callback('Empty')
            }
            closeDb()
        });
    });
}

module.exports = getUserData;
