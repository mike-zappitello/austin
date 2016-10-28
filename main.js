var fs      = require('fs'),
    austin  = require('./lib/austin.js'),
    path    = require('path');

var args = process.argv.slice(2);

// get the configuration from the config file
var configuration = JSON.parse(fs.readFileSync(args[0]));

configuration.loggingDir = path.resolve(__dirname, 'logs');

// spawn an austin carr bot
var austin_carr = austin.Austin(configuration);
