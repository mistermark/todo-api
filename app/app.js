// BASE SETUP
// =============================================================================

var express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  fs = require('fs');

var config = require('./config/configuration')
  env = process.env.NODE_ENV,
  middlewares = require('./middlewares'),
  todo = require('./routes/todo');

var app = express();


// Logging
var accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log', {flags: 'a'});
app.use(morgan('dev', {stream: accessLogStream}));


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(middlewares.setHeaders([
  { key: "Access-Control-Allow-Origin", value: "*" },
  { key: "Access-Control-Allow-Methods", value: "GET,PUT,POST,DELETE,OPTIONS" },
  { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, Content-Length, X-Requested-With" }
]));

var allowCORS = function(req, res, next) {
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
}

app.use(allowCORS);


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router


router.use(function(req, res, next) {
  console.log('%s %s - %s', (new Date).toString(), req.method, req.url);
  next();
});


router.get('/', function(req, res) {
  res.json({
    message: "Phoobar"
  });
});


router.get('/todos', todo.get);
router.post('/todos', todo.create);
router.put('/todos/:id', todo.update);
router.delete('/todos/:id', todo.remove);



// on routes that end in /todo/:id
// ----------------------------------------------------
router.route('/todos/:todo_id')

  .get(function(req, res, next) {
    Todo.findById(req.params.todo_id, function(err, todo) {

      if (err || !todo)
        return next(err);

      res.json(todo);
    })
  });


// ERROR HANDLING ------------------------------------
router.use(function(req, res, next) {

  res.status(404);

  if (req.accepts('html')) {
    res.send('404: Not found!');
  } else if (req.accepts('json')) {
    res.send({
      error: '404: Not found!'
    });
  }

});

router.use(function(err, req, res, next) {

  if (req.accepts('html')) {
    res.send('Error ' + err.status + ': ' + err.message);
  } else if (req.accepts('json')) {
    res.send(err);
  }
  res.status(500);

});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

app.use(config.urlbase, router);



// START THE SERVER
// =============================================================================
app.listen(config.port);

console.log('App running on port: ' + config.port);
console.log('Connected to database on: ' + config.db[env].url);
