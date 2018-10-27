var twilio = require('twilio');

const sendText = (username, callback) => {

    var MongoClient = require('mongodb').MongoClient;

    //Connection details for mLab if environmental variables exist (deployed from cloud)
    if (process.env.mLabUser){
        let dbUsername = process.env.mLabUser;
        let dbPassword = process.env.mLabPassword;
        var url = "mongodb://" + dbUsername + ':' + dbPassword + "@ds119052.mlab.com:19052/mydb";
    }
    //Local mongodb url
    else{
        var url = "mongodb://localhost:27017/myapp";
    }
    MongoClient.connect(url, function(err, db) {

        var query = {Username: username}

        if (err) throw err;
        console.log("Database Connected!");
        
        if(process.env.mLabUser){
            var dbo = db.db("mydb");
        }
        else{
            var dbo = db.db("myapp")
        }
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
        
            db.close();
        });

        

        
    });
}

module.exports = sendText;
