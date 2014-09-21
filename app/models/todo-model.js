var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TodoSchema   = new Schema({
  title: String,
  done: Boolean,
  date: Date
});

module.exports = mongoose.model('Todo', TodoSchema);
