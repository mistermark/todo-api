var express = require('express'),
  favicon = require('serve-favicon'),
  mongoose = require('mongoose'),
  app = express(),
  bodyParser = require('body-parser');

var base = '/api',
  port = process.env.PORT || 5123;

var Todo = require('./app/models/todos');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// app.use(favicon(__dirname + '/static/favicon.ico'));


mongoose.connect('mongodb://@localhost:27017/ds_todoist');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();        // get an instance of the express Router

router.use(function(req, res, next) {
  console.log('%s %s - %s', (new Date).toString(), req.method, req.url);
  return next();
});


router.get('/', function(req, res) {
  res.json({ message: "Phoobar" });
});

// app.get('/todo/random', function(req, res) {
//   var id = Math.floor(Math.random() * quotes.length);
//   var q = quotes[id];
//   res.json(q);
// });

// app.get('/todo/:id', function(req, res) {
//   if (quotes.length <= req.params.id || req.params.id < 0) {
//     res.statusCode = 404;
//     return res.send('Error 404: No quote found');
//   }
//   var q = quotes[req.params.id];
//   res.json(q);
// });


// app.post('/todo', function(req, res) {
//   if (!req.body.hasOwnProperty('title')) {

//     res.statusCode = 400;
//     return res.send('Error 400: Post syntax incorrect.');

//   }

//   var todo = new Todo();
//   todo.title = req.body.title;

//   todo.save(function(err) {
//     if (err)
//       res.send(err);

//     res.json({ message: "Todo added"});
//   })

// });

// app.delete('/todo/:id', function(req, res) {
//   if (quotes.length <= req.params.id) {
//     res.statusCode = 404;
//     return res.send('Error 404: No quote found');
//   }

//   quotes.splice(req.params.id, 1);
//   res.json(true);
// });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.all(base, router);

// GET: http://localhost:5123/api/todo


// START THE SERVER
// =============================================================================
app.listen(port);

console.log('App running on port: ' + port);
