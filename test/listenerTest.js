'use strict'

// some fun modules we need to run this test!
let path = require('path');
let fs   = require('fs');

// setup the resources we'll use in this listener
let resources = {
  nbaRequest: require('./../lib/nbaRequest')
};

// get the passed in args. they should be formatted thusly:
// 1st arg - relative file path to a listener.js file
// 2nd arg - the message you want to test on the listener
var args = process.argv.slice(2);

// get the full filepath for the .js file that exports the listener.
// from there we'll grab its constructor.
// if something goes wrong log it and exit
let listenerConstructor;
let listenerFilePath = path.resolve(process.cwd(), args[0]);
try {
  fs.accessSync(listenerFilePath, fs.F_OK); 
  listenerConstructor = require(listenerFilePath).listener;
} catch (e) {
  console.log("unable to load listener at " + listenerFilePath);
  console.log(e);
  process.exit(1);
}

// create the listener and log it
let listener = listenerConstructor(null);
console.log("Initialized Listener " + listener.name);

// grab the message from the arguments, log it, and have the listener handle it
let message = args[1];
console.log("Message:");
console.log(message);
let info = listener.handle(message);

// if the listner was able to handle the message, log the info it parsed out,
// compose a response and log the response.
if (info) {
  console.log("Info Parsed From Message:");
  console.log(info);

  let logResponse = function(response) {
    console.log("Listener Reply:");
    console.log(response);
  };
  listener.composeResponse(info, resources, logResponse);

// if the listener is unable to handle the message log that.
} else {
  console.log("The listener did not care about your message");
}
