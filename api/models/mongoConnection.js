const mongoConnection = (callback) => {
    var MongoClient = require('mongodb').MongoClient;
    //Connection details for mLab if environmental variables exist (deployed from cloud)
    if (process.env.mLabUser){
        let dbUsername = process.env.mLabUser;
        let dbPassword = process.env.mLabPassword;
        var url = "mongodb://" + dbUsername + ':' + dbPassword + "@ds137197.mlab.com:37197/stat_tracker";
    }
    else if(process.env.MONGODB_URI){
        var url = process.env.MONGODB_URI;
    }
    //Local mongodb url
    else{
        var url = "mongodb://localhost:27017/stat_tracker";
    }

    MongoClient.connect(url, function(err, db) {
        //console.log("Database Connected!");
        if(err)
        {
            console.log(err);
        }
        else{
            if(process.env.mLabUser){
                var dbo = db.db("stat_tracker");
            }
            else if(process.env.MONGODB_URI){
                var dbo = db.db("heroku_rdx1d6t2");
            }
            else{
                var dbo = db.db("stat_tracker")
            }

            callback((dbo), function(){
                db.close();
            })
        }
    })

}

module.exports = mongoConnection;
