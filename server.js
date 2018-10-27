const express = require('express');
var bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const uuidv4 = require('uuid/v4');
const router = express.Router();
var cors = require('cors');
const app = express();
const port = process.env.PORT || 4200;
app.use(express.static(`${__dirname}/client/build`));
app.use(bodyParser.urlencoded({ extended: false }))

if (process.env.mLabUser){
  let dbUsername = process.env.mLabUser;
  let dbPassword = process.env.mLabPassword;
  var url = "mongodb://" + dbUsername + ':' + dbPassword + "@ds119052.mlab.com:19052/mydb";
}
//Local mongodb url
else{
  var url = "mongodb://localhost:27017/myapp";
}

var sess = {
  secret: 'keyboard cat',
  cookie: {maxAge: 300000},
  saveUninitialized: false,
  resave: false,
  unset: 'destroy',
  genid: function(req){
    return uuidv4();
  },
  store:new MongoStore({url: url})
}
 
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

/*if (app.get('env') === 'production' && app.get('MEMCACHE_URL')) {
  sessionConfig.store = new MemcachedStore({
    hosts: [app.get('MEMCACHE_URL')]
  });
}*/
 
app.use(session(sess))

// parse application/json
app.use(bodyParser.json())
//add routes to express app
var routes = require('./api/routes/routes.js'); //importing route

app.use(cors());
app.use('/', routes);

//start Express server on defined port
app.listen(port);

console.log('API server started on: ' + port);