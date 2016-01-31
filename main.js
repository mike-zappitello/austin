var fs = require('fs'),
    austin = require('./lib/austin.js');

var configuration = JSON.parse(fs.readFileSync('configuration.json'));

var austin_carr = austin.Austin(configuration);

