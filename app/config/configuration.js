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
    name: 'ds_todoist',
    url: 'kahana.mongohq.com',
    port: '10053',
    username: process.env.MONGOHQ_USER || "dappersome",
    password: process.env.MONGOHQ_PASS || ",d4pp3rs0m3."
  }
}

module.exports = config;
