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

  let token = configuration.slackToken;

  let webClicent = new WebClient(token);
  let rtmOptions = {
    logLevel: 'error',
    maxReconnectionAttempts: 20,
    reconnectionBackoff: 10000
  };
  let rtmClient = new RtmClient(token, rtmOptions);

  rtmClient.start();

  rtmClient.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    messageParser.parse(webClient, nbaContext, message);
  });

  /*
  // when slack opens, start up austin and start scheduling tasks using
  // scheduler
  // TODO - maybe make the scheduler its own object?
  slack.on('open', function(data) {
    console.log("Starting up Austin Carr");

    // let watchGames = scheduler.watchGames(nbaContext);
    // let nightlyCleanup = scheduler.nightlyCleanup(nbaContext);
  });

  // when slack recieves a message, parse it and respond using message parser
  slack.on('message', function(message) {
    messageParser.parse(slack, nbaContext, message);
  });

  // when slack has an error, log it
  slack.on('error', function(error) {
    console.log("error!!!\n" + error.message);
  });
  */
}

module.exports = {
  Austin: Austin
};
