/// Contains the logic for Ausin recieving, proccessing, and replying to
/// messages.
///
/// Exports:
///   Austin: Austin -- object representing the slack bot

"use strict";

let context = require('./context'),
    messageParser = require('./messageParser'),
    scheduler = require('./scheduler'),
    Slack = require('slack-client');

/// The bot that signs into slack, keeps track of the nba, and responds to
/// messages.
let Austin = function(configuration) {
    // create a new slack object to receive and send messages
    let slack = new Slack(
            configuration.slackToken, configuration.autoReconnect,
            configuration.autoMark);

    // create an nbaContext object to store our current situation
    let nbaContext = context.context();

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

    // login to slack
    slack.login();

    // TODO - i'm pretty sure we don't need to return this object, and it should
    // probably be encapsulated anyway.
    return slack;
}

module.exports = {
  Austin: Austin
};
