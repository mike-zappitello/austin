var austin     = require('./lib/austin.js'),
    loadConfig = require('./lib/configLoader').loadConfig;

var args = process.argv.slice(2);

// get the configuration from the config file
// TODO(mike) - this should also be creating the resources and be moved to the
// constructor of austin.
var configuration = loadConfig(args[0]);

// spawn an austin carr bot
var austin_carr = austin.Austin(configuration);
