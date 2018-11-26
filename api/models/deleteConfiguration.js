const mongoConnection = require('../models/mongoConnection.js');

const deleteConfiguration = (username, configName, callback) => {

    mongoConnection(function(dbo, closeDb){

        const query = {Username: username}
        const unset = {$unset: {['Configurations.' + configName]: ""}}
        dbo.collection("Configs").update(query, unset, function(err, res) {
            if (err) throw err;
            callback('Job deleted from DB')
        });
        closeDb()
    });    
}

module.exports = deleteConfiguration;
