var session = require('express-session')
const bcrypt = require('bcrypt');
const mongoConnection = require('../models/mongoConnection.js');

const validateCreds = (req, callback) => {

    mongoConnection(function(dbo, closeDb){

        var query = {Username: req.username}
        
        //Find object for passed username
        dbo.collection("Users").find(query).toArray(function myFunc(err, result) {
            if (err) throw err;

            //if user is found, validate user password
            if(result.length){
                bcrypt.compare(req.password, result[0].Password, function(err, res) {
                    if(res) {
                        callback('Correct');
                    } else {
                        callback('Incorrect');
                    } 
                });
            }
            else{
                callback('Incorrect');
            }    
            closeDb()
        });
    });

}

module.exports = validateCreds;
