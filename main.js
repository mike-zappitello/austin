"use strict";

const austin     = require('./lib/austin.js');
const loadConfig = require('./lib/configLoader').loadConfig;

const args = process.argv.slice(2);

// get the configuration from the config file
const configuration = loadConfig(args[0]);

// spawn an austin carr bot
const austin_carr = austin.Austin(configuration);
