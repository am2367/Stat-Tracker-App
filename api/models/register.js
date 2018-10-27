const bcrypt = require('bcrypt');

const register = (req, callback) => {
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
        console.log("Database Connected!");
        
        if(process.env.mLabUser){
            var dbo = db.db("mydb");
        }
        else{
            var dbo = db.db("myapp")
        }

        dbo.collection("Entries").find({Username: req.username}).toArray(function myFunc(err, result) {
            if (err) throw err;
            if(result.length){
                callback('Username Taken');
                db.close();
                return;
            }
        });

        dbo.collection("Entries").find({Email: req.email}).toArray(function myFunc(err, result) {
            if (err) throw err;
            if(result.length){
                callback('Email Taken');
                db.close();
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

                register(user,dbo, db);
        });        
    })

    function register(user, dbo, db){
        dbo.collection("Users").insertOne(user, function(err, res) {
            if (err) throw err;
            console.log("Registered");
        });
        db.close();

        callback('Registered')
    }
}

module.exports = register;
