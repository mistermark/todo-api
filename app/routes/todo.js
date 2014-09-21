var mongoose = require('mongoose'),
  Todo = require('../models/todo-model');

var config = require('../config/configuration'),
  env = process.env.NODE_ENV;


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
mongoose.connection.on('error', function() {
  console.log('moongoose connection error.');
});


exports.get = function(req, res) {

  Todo.find({}, function(err, todos) {

    if (err)
      return next(err);

    res.json(todos);
  });
};

exports.create = function(req, res, next) {
  
  if (!req.body.hasOwnProperty('title') || req.body.title == '') {
    res.statusCode = 400;
    return next({
      message: 'Field "title" cannot be empty',
      status: 400,
      request: req.body
    });
  }

  var newTodo = new Todo({
    date: new Date(),
    title: req.body.title,
    done: req.body.done || false
  });

  newTodo.save(function(err, todo) {
    if (err)
      return next(err);

    res.json({
      status: "SUCCESS",
      object: {
        title: todo.title,
        id: todo.id,
        done: todo.done,
        date: todo.date
      }
    });
  });

};

exports.update = function(req, res, next) {
  console.log(req.body);

  Todo.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: {
      done: req.body.done
    }
  }, function(err, todo) {

    if (err)
      return next(err);

    todo.save(function(err, todo) {
      if (err)
        return next(err);

      res.json({
        status: "SUCCESS",
        object: {
          title: todo.title,
          id: todo.id,
          done: todo.done
        }
      });
    });

  });
};


exports.remove = function(req, res, next) {

  Todo.findOneAndRemove({
    _id: req.params.id
  }, function(err, todo) {
    if (err)
      return next(err);

    res.json({
        status: "SUCCESS",
        object: {
          title: todo.title,
          id: todo.id,
          done: todo.done
        }
      });
  });
};
