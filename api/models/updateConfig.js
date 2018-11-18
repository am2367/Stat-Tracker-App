const mongoConnection = require('../models/mongoConnection.js');

const updateConfig = (username, data, callback) => {
    mongoConnection(function(dbo, closeDb){

        dbo.collection("Configs").update({Username: username, Configurations: Object},
                                            {$set: 
                                                {['Configurations.' + data.configName] : data}}, 
                                            {upsert: true})            

        callback('Updated')
        closeDb()
    });

}

module.exports = updateConfig;
