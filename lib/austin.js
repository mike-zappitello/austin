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
      let channel = slack.getChannelGroupOrDMByID(message.channel);
      let response = '';

      nba_request.getPlayerStats(message.text, function(err, stats) {
        if (err) {
          response = err.message;
        }

        if (stats) {
          response = stats.playerName + ' | ' +
                  stats.pts + 'pts, ' +
                  stats.ast + 'ast, ' +
                  stats.reb + 'reb';
        }

        channel.send(response);
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
