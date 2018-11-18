const bcrypt = require('bcrypt');
const mongoConnection = require('../models/mongoConnection.js');

const register = (req, callback) => {

    mongoConnection(function(dbo, closeDb){

        dbo.collection("Entries").find({Username: req.username}).toArray(function myFunc(err, result) {
            if (err) throw err;
            if(result.length){
                callback('Username Taken');
                closeDb()
                return;
            }
        });

        dbo.collection("Entries").find({Email: req.email}).toArray(function myFunc(err, result) {
            if (err) throw err;
            if(result.length){
                callback('Email Taken');
                closeDb()
                return;
            }
        });

        bcrypt.hash(req.password, 10, function(err, hash) {
            let user = {Username: req.username, 
                Password: hash, 
                LastName: req.lastName, 
                FirstName: req.firstName,
                Email: req.email,
                Phone: req.phone}

                register(user);
        });

        function register(user){
            dbo.collection("Users").insertOne(user, function(err, res) {
                if (err) throw err;
                console.log("Registered");
            });
            callback('Registered')
            closeDb()
        }
        
    }); 
}

module.exports = register;
