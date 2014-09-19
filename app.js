
// BASE SETUP
// =============================================================================

var express = require('express'),
  favicon = require('serve-favicon'),
  mongoose = require('mongoose'),
  app = express(),
  bodyParser = require('body-parser');

var base = '/api',
  port = process.env.PORT || 5123;

var Todo = require('./app/models/todos');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// app.use(favicon(__dirname + '/static/favicon.ico'));


mongoose.connect('mongodb://@localhost:27017/ds_todoist');


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();        // get an instance of the express Router

router.use(function(req, res, next) {
  console.log('%s %s - %s', (new Date).toString(), req.method, req.url);
  next();
});


router.get('/', function(req, res) {
  res.json({ message: "Phoobar" });
});

// app.get('/todo/:id', function(req, res) {
//   if (quotes.length <= req.params.id || req.params.id < 0) {
//     res.statusCode = 404;
//     return res.send('Error 404: No quote found');
//   }
//   var q = quotes[req.params.id];
//   res.json(q);
// });

router.route('/todos')

  // POST a new todo
  .post(function (req, res) {
    // if (!req.body.hasOwnProperty('title') || req.body.title != '') {
    //   res.statusCode = 400;
    //   res.send('Error 400: Post syntax incorrect');
    // }

    var todo = new Todo();
    todo.title = req.body.title;
    todo.done = false;

    todo.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: "Todo added"});
    });

  })

  // GET all todos
  .get(function(req, res) {
    Todo.find(function(err, todos) {
      if (err)
        res.send(err);

      res.json(todos);
    });
  });

// app.delete('/todo/:id', function(req, res) {
//   if (quotes.length <= req.params.id) {
//     res.statusCode = 404;
//     return res.send('Error 404: No quote found');
//   }

//   quotes.splice(req.params.id, 1);
//   res.json(true);
// });



// ERROR HANDLING ------------------------------------
router.use(function(req, res, next) {

  res.status(404);
  if (req.accepts('html')) {
    res.send('404: Not found!');
  }
  else if (req.accepts('json')) {
    res.send({ error: '404: Not found!' });
  }

});

router.use(function(err, req, res, next) {

  if (req.accepts('html')) {
    res.send('500: Server error!');
  }
  else if (req.accepts('json')) {
    res.send({ error: '500: Server error!' });
  }
  res.status(500);

});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

app.use(base, router);



// START THE SERVER
// =============================================================================
app.listen(port);

console.log('App running on port: ' + port);
