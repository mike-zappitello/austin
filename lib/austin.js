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

let context = require('./context');
let messageParser = require('./messageParser');
let scheduler = require('./scheduler');

/// The bot that signs into slack, keeps track of the nba, and responds to
/// messages.
let Austin = function(configuration) {
  // create a logger for the bot
  let dateString = new Date().toJSON().slice(0, 16);
  let logFilename = 'austin-logging-' + dateString + '.log';
  let austinLogger = new Winston.Logger( {
    transports: [
      new (Winston.transports.File) ( {
        name: 'austin-logging',
        dirname: configuration.loggingDir,
        filename: logFilename,
        level: 'info',
        prettyPrint: true,
        maxFiles: 3
      } )
    ]
  });
  austinLogger.info("starting up an instance of austin");

  let nbaContext = context.context();

  // get the slack token from the configuration. needed for the web and rtm
  // clients
  let token = configuration.slackToken;

  // create a web client
  let webClient = new WebClient(
      token,
      { retryConfig: { retries: 5, factor: 3.9 }, logger: austinLogger }
  );

  // create a message parser to handle all messages and add listeners
  let parser = new messageParser.MessageParser(
      webClient,
      nbaContext,
      austinLogger
  );
  parser.addListener(messageParser.playerStatsParser);

  // create a real time messaging client, start it, and connect events to
  // functions.
  let rtmClient = new RtmClient(
      token,
      {
        logLevel: 'info',
        maxReconnectionAttempts: 20,
        reconnectionBackoff: 10000
      }
  );
  rtmClient.start();
  rtmClient.on(RTM_EVENTS.MESSAGE, parser.handleMessage(message));
}

module.exports = {
  Austin: Austin
};
