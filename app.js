var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

var base = '/api',
    port = process.env.PORT || 5123;

// app.use(express.bodyParser());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.favicon());


// MongoHQ db: mongodb://dappersome:,d4pp3rs0m3.@kahana.mongohq.com:10053/ds_todoist
var quotes = [
  { author: 'Audrey Hepburn', text: "Nothing is impossible, the word itself says 'I'm possible'!" },
  { author: 'Walt Disney', text: "You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you" },
  { author: 'Unknown', text: "Even the greatest was once a beginner. Don't be afraid to take that first step."},
  { author: 'Neale Donald Walsch', text: "You are afraid to die, and you're afraid to live. What a way to exist."}
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTES FOR OUR API
// =============================================================================
// var router = express.Router();        // get an instance of the express Router

app.get('/', function(req, res) {
  res.json(quotes);
});

app.get('/quote/random', function(req, res) {
  var id = Math.floor(Math.random() * quotes.length);
  var q = quotes[id];
  res.json(q);
});


app.get('/quote/:id', function(req, res) {
  if (quotes.length <= req.params.id || req.params.id < 0) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }
  var q = quotes[req.params.id];
  res.json(q);
});

app.post('/quote', function(req, res) {
  if(!req.body.hasOwnProperty('author') || 
     !req.body.hasOwnProperty('text')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  } 
 
var newQuote = {
    author : req.body.author,
    text : req.body.text
  }; 
 
quotes.push(newQuote);
  res.json(true);
});

app.delete('/quote/:id', function(req, res) {
  if(quotes.length <= req.params.id) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }  

quotes.splice(req.params.id, 1);
  res.json(true);
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
// app.use(base, function(req, res, next) {
//   console.log('%s %s - %s', (new Date).toString(), req.method, req.url);
//   return next();
// });


// START THE SERVER
// =============================================================================
app.listen(port);

console.log('App running on port: ' + port);