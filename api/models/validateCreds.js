var session = require('express-session')
const bcrypt = require('bcrypt');

const validateCreds = (req, callback) => {

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

        var query = {Username: req.username}

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
        
            db.close();
        });

        

        
    });
}

module.exports = validateCreds;
