const mongoConnection = require('../models/mongoConnection.js');

const createDefaultConfigObject = (username, callback) => {
    mongoConnection(function(dbo, closeDb){

        dbo.collection("Configs").insertOne({Username: username, Configurations: Object}, function(err, res) {
            if (err) throw err;
            callback('Created')
        });
        closeDb()
    });

}

module.exports = createDefaultConfigObject;