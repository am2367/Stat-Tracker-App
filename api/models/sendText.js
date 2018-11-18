var twilio = require('twilio');
const mongoConnection = require('../models/mongoConnection.js');

const sendText = (username, callback) => {
    mongoConnection(function(dbo, closeDb){
    
        //Find object for passed username
        dbo.collection("Users").find(query).toArray(function myFunc(err, result) {
            if (err) throw err;

            //if user is found, validate user password
            if(result.length){
                var client = new twilio('AC10bc90ea5265bcadfaac199308b957f0', 'f677a67791c5801d49fa85a23b1d3c15');
                let phone = '+1' + result[0].Phone.replace(/\D/g,'');
                
                client.messages.create({
                    to: phone,
                    from: '+15512317496',
                    body: 'Ahoy from Twilio!'
                    }).then(message => callback(message.sid))
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
