/// Contains the logic for Ausin recieving, proccessing, and replying to
/// messages.
///
/// Exports:
///   Austin: Austin -- object representing the slack bot

"use strict";

let WebClient = require('slack-client').WebClient;
let RtmClient = require('slack-client').RtmClient;
let RTM_EVENTS = require('slack-client').RTM_EVENTS;

let context = require('./context');
let messageParser = require('./messageParser');
let scheduler = require('./scheduler');

/// The bot that signs into slack, keeps track of the nba, and responds to
/// messages.
let Austin = function(configuration) {
  // create an nbaContext object to store our current situation
  let nbaContext = context.context();

  // get the slack token from the configuration. needed for the web and rtm
  // clients
  let token = configuration.slackToken;

  // create a web client
  let webClient = new WebClient(token);

  // create a real time messaging client
  let rtmOptions = {
    logLevel: 'error',
    maxReconnectionAttempts: 20,
    reconnectionBackoff: 10000
  };
  let rtmClient = new RtmClient(token, rtmOptions);
  rtmClient.start();

  // on messages, send them to the message parser
  rtmClient.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    messageParser.parse(webClient, nbaContext, message);
  });
}

module.exports = {
  Austin: Austin
};
