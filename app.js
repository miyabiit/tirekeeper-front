/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var lessMiddleware = require('less-middleware');
var ECT = require('ect'); // ECT 読み込み
var flash = require('connect-flash'); // flash message
var mongo = require('mongoose');
var config = require('config');
var logger = require('./utils/logger');

var app = express();

//Log4js setting
app.use(logger.accessConfig);

// mongodb connect
var connect =function() {
  mongo.connect(config.db);
};
connect();
mongo.connection.once('open', function() {
  console.log("Connected to 'tireke' database");
});
mongo.connection.on('error', console.error.bind(console, 'connection error:'));
mongo.connection.on('disconnected', connect);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('ect', ECT({ watch: true, root: __dirname + '/views', ext: '.ect' }).render);
app.set('view engine', 'ect');
app.set('case sensitive routing', true);

var bootstrapPath = path.join(__dirname, 'node_modules', 'bootstrap');
app.use('/img', express.static(path.join(bootstrapPath, 'img')));

// less -> css
app.use(lessMiddleware(path.join(__dirname, 'views'), {
  debug : true,
  force: false,
  once : true,
  dest : path.join(__dirname, 'public'),
  render : {
    compress : false, // リリース時はtrue
    paths : [ path.join(bootstrapPath, 'less') ]
  }
}));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('some_secret'));
app.use(express.session());
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

// loginチェック
app.use(require('./routes/login'));
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  res.locals.flash = req.flash();
  next();
});

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./config/routes')(app);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
  logger.info('start');
});

