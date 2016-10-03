var fs      = require('fs'),
    austin  = require('./lib/austin.js'),
    path    = require('path');

// get the configuration from the config file
var configuration = JSON.parse(fs.readFileSync('configuration.json'));

configuration.loggingDir = path.resolve(__dirname, 'logs');

// spawn an austin carr bot
var austin_carr = austin.Austin(configuration);
