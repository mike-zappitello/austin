var fs = require('fs'),
    austin = require('./lib/austin.js');

// get the configuration from the config file
var configuration = JSON.parse(fs.readFileSync('configuration.json'));

// spawn an austin carr bot
var austin_carr = austin.Austin(configuration);
