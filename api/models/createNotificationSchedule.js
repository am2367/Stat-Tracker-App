const createNotificationSchedule = (username, callback) => {

    if (process.env.mLabUser){
        let dbUsername = process.env.mLabUser;
        let dbPassword = process.env.mLabPassword;
        var url = "mongodb://" + dbUsername + ':' + dbPassword + "@ds119052.mlab.com:19052/stat_tracker";
    }
    //Local mongodb url
    else{
        var url = "mongodb://localhost:27017/stat_tracker";
    }

    const agenda = new Agenda({db: {address: url}});
    

}

module.exports = createNotificationSchedule;
