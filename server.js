var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

var activityRouter = express.Router();

activityRouter.use(bodyParser.json());

activityRouter.route('/')
.all(function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
}).get(function(req,res,next){
        res.end('Providing all activities!');
}).post(function(req, res, next) {
    res.end('Post activity: ' + req.body.name + ' with description: ' + req.body.description);
}).delete(function(req, res, next) {
        res.end('Deleting all activities');
});

activityRouter.route('/:activityID')
.all(function(req,res,next) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      next();
}).get(function(req,res,next) {
        res.end('Will send details of the activity: ' + req.params.activityID
          +' to you!');
}).put(function(req, res, next) {
        res.write('Updating the activity: ' + req.params.activityID + '\n');
    res.end('Will update the activity: ' + req.body.name +
            ' with details: ' + req.body.description);
}).delete(function(req, res, next) {
        res.end('Deleting activity: ' + req.params.activityID);
});

app.use('/activity', activityRouter);

app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});
