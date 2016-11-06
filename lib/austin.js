/// Contains the logic for Ausin recieving, proccessing, and replying to
/// messages.
///
/// Exports:
///   Austin: Austin -- object representing the slack bot

"use strict";

let WebClient = require('slack-client').WebClient;
let RtmClient = require('slack-client').RtmClient;
let RTM_EVENTS = require('slack-client').RTM_EVENTS;
let Winston = require('winston');

let messageParser = require('./messageParser');
let scheduler = require('./scheduler');

/// The bot that signs into slack, keeps track of the nba, and responds to
/// messages.
let Austin = function(configuration) {
  let resources = { };
  // initialize the logger
  resources.logger = new Winston.Logger( {
    transports: [
      new (Winston.transports.File) ( {
        name: 'austin-logging',
        dirname: configuration.loggingDir,
        filename: configuration.name + '.log',
        level: 'info',
        maxFiles: 3,
        json: false,
        prettyPrint: true,
        humanReadableUnhandledException: true,
        timestamp: function() {
          let date = new Date();

          let h = new String(date.getHours());
          let m = new String(date.getMinutes());

          let hour = h.length === 1 ? '0' + h : h;
          let minute = m.length === 1 ? '0' + m : m;

          return hour + ":" + minute;
        }
      } )
    ]
  });

  resources.logger.info("starting up an instance of austin");

  // create a web client
  let wcParams = {        // TODO(zap) - move this to config.js
    retryConfig: { retries: 5, factor: 3.9 },
    logger: resources.logger 
  };
  let webClient = new WebClient(configuration.slackToken, wcParams);

  // create a message parser to handle all messages and add listeners
  let parser = new messageParser.MessageParser(webClient, resources.logger);
  parser.addListener(messageParser.playerStatsParser(resources.logger));

  // create a real time messaging client, start it, and connect events to
  // functions.
  let rtmParams = {       // TODO(zap) - move this to config.js
    logLevel: 'info',
    maxReconnectionAttempts: 20,
    reconnectionBackoff: 10000
  };
  let rtmClient = new RtmClient(configuration.slackToken, rtmParams);
  rtmClient.start();
  rtmClient.on(RTM_EVENTS.MESSAGE, function(message) {
      parser.handleMessage(message)
  });
}

module.exports = {
  Austin: Austin
};
