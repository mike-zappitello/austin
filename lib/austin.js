"use strict";

let Slack = require('slack-client'),
    nba_request = require('./nba_request');

let Austin = function(configuration) {
    let slack = new Slack(
            configuration.slackToken, configuration.autoReconnect,
            configuration.autoMark);

    // parse a message that austin is able to see
    //
    // @param message - the incoming message with the following properties
    //  * type
    //  * channel
    //  * user
    //  * text
    //  * ts
    //  * team
    let parse_message = function(message) {
      console.log("new message:");
      for (let property in message) {
          if (message.hasOwnProperty(property)) {
            console.log("\t" + property + ": " + message[property]);
          }
      }

      nba_request.getPlayerStats(message.text, function(stats) {
        console.log(stats);
      });
    }

    slack.on('open', function(data) {
      console.log("Started Bot!\n");
    });

    slack.on('message', parse_message);

    slack.on('error', function(error) {
      console.log("error\n" + error);
    });

    slack.login();

    return slack;
}

module.exports = {
  Austin: Austin
}
