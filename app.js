// BASE SETUP
// =============================================================================

var express = require('express'),
  favicon = require('serve-favicon'),
  mongoose = require('mongoose'),
  app = express(),
  bodyParser = require('body-parser');

var config = require('./app/config/configuration'),
  Todo = require('./app/models/todos'),
  env = process.env.NODE_ENV;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// app.use(favicon(__dirname + '/static/favicon.ico'));


// CONNECT TO OUR MONGODB
// =============================================================================
var dbOptions = {
  user: config.db[env].username,
  pass: config.db[env].password,
  replset: {
    socketOptions: {
      keepAlive: 1
    }
  }
}
mongoose.connect('mongodb://' + '@' + config.db[env].url + ':' + config.db[env].port +
  '/' + config.db[env].name, dbOptions);


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

router.use(function(req, res, next) {
  console.log('%s %s - %s', (new Date).toString(), req.method, req.url);
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
  next();
});


router.get('/', function(req, res) {
  res.json({
    message: "Phoobar"
  });
});


router.route('/todos')

  // POST a new todo
  .post(function(req, res, next) {
    // if (!req.body.hasOwnProperty('title') || req.body.title == '') {
    //   res.statusCode = 400;
    //   return next({
    //     message: 'Post syntax incorrect',
    //     status: 400,
    //     request: req.body
    //   });
    // }

    var todo = new Todo();
    todo.title = req.body.title;
    todo.done = false;

    console.log(req.body);

    todo.save(function(err) {
      if (err)
        return next(err);

      res.json({
        message: "Todo added"
      });
    });

  })

  // GET all todos
  .get(function(req, res) {
    Todo.find(function(err, todos) {
      if (err)
        return next(err);
      res.json(todos);
    });
  });

// on routes that end in /todo/:id
// ----------------------------------------------------
router.route('/todos/:todo_id')

  .get(function(req, res, next) {
    Todo.findById(req.params.todo_id, function(err, todo) {

      if (err || !todo)
        return next(err);

      res.json(todo);
    })
  })

  .put(function(req, res, next) {
    Todo.findById(req.params.todo_id, function(err, todo) {

      if (err)
        return next(err);

      todo.title = req.body.title;

      todo.save(function(err) {
        if (err)
          return next(err);

        res.json({
          message: 'Todo updated.'
        });
      });

    });
  })

  .delete(function(req, res, next) {
    Todo.remove({
      _id: req.params.todo_id
    }, function(err, todo) {
      if (err)
        return next(err);

      res.json({
        message: 'Todo deleted'
      });
    });
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
