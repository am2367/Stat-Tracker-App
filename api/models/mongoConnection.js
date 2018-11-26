const mongoConnection = (callback) => {
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
        //console.log("Database Connected!");
        
        if(process.env.mLabUser){
            var dbo = db.db("stat_tracker");
        }
        else{
            var dbo = db.db("stat_tracker")
        }

        callback((dbo), function(){
            db.close();
        })
    })

}

module.exports = mongoConnection;
