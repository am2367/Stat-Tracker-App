const getUserData = (username,callback) => {
    var MongoClient = require('mongodb').MongoClient;
    //Connection details for mLab if environmental variables exist (deployed from cloud)
    if (process.env.mLabUser){
        let dbUsername = process.env.mLabUser;
        let dbPassword = process.env.mLabPassword;
        var url = "mongodb://" + dbUsername + ':' + dbPassword + "@ds119052.mlab.com:19052/stat_tracker";
    }
    //Local mongodb url
    else{
        var url = "mongodb://localhost:27017/stat_tracker";
    }
    MongoClient.connect(url, function(err, db) {
        
        if (err) throw err;
        console.log("Database Connected!");
        
        if(process.env.mLabUser){
            var dbo = db.db("stat_tracker");
        }
        else{
            var dbo = db.db("stat_tracker")
        }

        var query = {Configurations : {'$exists' : 1}, Username: username};

        dbo.collection("Configs").find(query).toArray(function myFunc(err, result) {
            if (err) throw err;
            if(result.length){
                callback(result[0]);
                db.close();
                return;
            }
            else{
                callback('Empty')
                db.close();
                return;
            }
            db.close();
        });
    });
}

module.exports = getUserData;
