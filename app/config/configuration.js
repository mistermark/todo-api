/**
 * Global Configuration
 */

var config = {};
config.db = {};

// Connection settings
config.urlbase = '/api';
config.port = process.env.PORT || '5123';

config.db = {
  dev: {
    name: 'ds_todoist',
    url: 'localhost',
    port: '27017',
    username: '',
    password: ''
  },
  dist: {
    name: process.env.MONGOHQ_DBNAME || 'ds_todoist',
    url: process.env.MONGOHQ_URL || 'kahana.mongohq.com',
    port: process.env.MONGOHQ_PORT || '10053',
    username: process.env.MONGOHQ_USER || "username",
    password: process.env.MONGOHQ_PASS || "password"
  }
}

module.exports = config;
