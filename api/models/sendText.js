var twilio = require('twilio');
const mongoConnection = require('../models/mongoConnection.js');

const sendText = (username, question, callback) => {
    mongoConnection(function(dbo, closeDb){
        
        var query = {Username: username}

        //Find object for passed username
        dbo.collection("Users").find(query).toArray(function myFunc(err, result) {
            if (err) throw err;

            //if user is found
            if(result.length){
                var client = new twilio(process.env.twilioSID, process.env.twilioToken);
                let phone =  result[0].Phone
                
                client.messages.create({
                    to: phone,
                    from: process.env.twilioNumber,
                    body: question
                    }).then(message => callback('Question ' + question + ' sent to ' + username + ' by text at #' + phone + " at " + new Date()))
                    .done();
                
            }
            else{
                callback('Error');
            }    
        
            closeDb()
        
        });
    });
}

module.exports = sendText;
