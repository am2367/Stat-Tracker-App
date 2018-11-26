var nodemailer = require('nodemailer');
const mongoConnection = require('../models/mongoConnection.js');

const sendEmail = (username, question, callback) => {

    let smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
            user: process.env.smtpAuthUser,
            pass: process.env.smtpAuthPass
        }
    };

    let transporter = nodemailer.createTransport(smtpConfig)

    mongoConnection(function(dbo, closeDb){
        
        var query = {Username: username}

        //Find object for passed username
        dbo.collection("Users").find(query).toArray(function myFunc(err, result) {
            if (err) throw err;

            //if user is found
            if(result.length){
                let email = result[0].Email
                
                var mailOptions = {
                    from: '"Stat Tracker" <stattracker@yahoo.com>', // sender address
                    to: [email], // list of receivers
                    subject: 'Your Question', // Subject line
                    text: question // plaintext body
                };

                console.log(mailOptions)
                
                // send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    callback('Message sent: ' + info.response);
                });
            }
            else{
                callback('Error');
            }    
        
            closeDb()
        
        });
    });
}

module.exports = sendEmail;
