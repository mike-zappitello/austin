/// Contains the logic for parsing messages and looking for events slackbot
/// reponds to.
///
/// Exports:
///   * parse - function that parses messages and responds

"use strict";

let re = require('named-regexp').named,
    nbaRequest = require('./nbaRequest');

/// look at a message and respond to it if necessary
///
/// @slack - a representation of the current slack session
/// @context - the nba context for what austin know about
/// @message - the message that was sent in
///   * type
///   * channel
///   * user
///   * text
///   * ts
///   * team
let parse = function(slack, context, message) {
  // get the channel and make sure that we're a member of the chanel
  let channel = slack.getChannelGroupOrDMByID(message.channel);
  if (!channel.is_member) {
    return;
  }

  // for each listener, try to match the the message, and respond if succesful
  for (let id in listeners) {
    // get the listener
    let listener = listeners[id]

    // try to match the pattern for the listener. if there is a match, use the
    // listeners createResponse method, and send that response to the channel.
    let matched = listener.pattern.exec(message.text);
    if (matched) {
      listener.response(channel, matched, context);
    }
  }
};

// list of listener object. each one needs to contain a regex pattern that will
// be matched and a function to generate a response.
let listeners = [
  // listener responsible for hearing "stats <player_name>" and responding with
  // the stats for that players season to date
  {
    pattern: re(/^stats (:<player>.*)/ig),
    response: function(channel, matched, context) {
      // create an empty response and get the players name from the match
      let response;
      let playerName = matched.captures.player[0];

      // run the nba request for player stats, and reply when it completes
      nbaRequest.getPlayerStats(playerName, function(err, stats) {
        if (err) {
          response = err.message;
        }
        if (stats) {
          response =
              stats.playerName + ' | ' + stats.pts + 'pts, ' + stats.ast +
              'ast, ' + stats.reb + 'reb';
        }
        channel.send(response);
      });
    }
  },

  // listener responsible for hearing '.games' and posting all of tonights games
  // as they are in the context
  {
    pattern: re(/^\.games$/ig),
    response: function(channel, matched, context) {
      let response;

      if (Object.keys(context.games).length === 0) {
        response = "There are no scheduled games today :frowning:";
      } else {
        response = "Todays Games:\n";
        for (let n in context.games) {
          let game = context.games[n];

          response = response +
            context.teams[game.roadTeam].simpleName + ' @ ' +
            context.teams[game.homeTeam].simpleName + ' (' +
            game.statusText + ')\n';
        }
      }
      channel.send(response);
    }
  }
];

module.exports = {
  parse: parse
};
