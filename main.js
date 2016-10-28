var austin     = require('./lib/austin.js'),
    loadConfig = require('./lib/configLoader').loadConfig;

var args = process.argv.slice(2);

// get the configuration from the config file
var configuration = loadConfig(args[0]);

// spawn an austin carr bot
var austin_carr = austin.Austin(configuration);
