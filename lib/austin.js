/// Contains the logic for Ausin recieving, proccessing, and replying to
/// messages.
///
/// Exports:
///   Austin: Austin -- object representing the slack bot

"use strict";

let Slack = require('slack-client'),
    re = require('named-regexp').named,
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
      // get the channel that the message was sent in
      let channel = slack.getChannelGroupOrDMByID(message.channel);

      // if austin isn't a member of that channel, ignore what was said
      if (!channel.is_member) {
        return;
      }

      let response = '';


      /// --- A BIG TO DO --- /// 
      /// create and array of potential responses with a their regex, function
      /// based on match, user facing description

      // check to look for someone asking for stats
      let stats_regex = re(/^stats (:<player>.*)/ig);
      let matched = stats_regex.exec(message.text);
      if (matched) {
          let playerName = matched.captures.player[0];
          nba_request.getPlayerStats(playerName, function(err, stats) {
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
    }

    slack.on('open', function(data) {
      console.log("Started Bot!\n");
    });

    slack.on('message', parse_message);

    slack.on('error', function(error) {
      console.log("error!!!\n" + error.message);
    });

    slack.login();

    return slack;
}

module.exports = {
  Austin: Austin
}
