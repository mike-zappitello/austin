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
/// @webClient - a representation of the current slack session
/// @context - the nba context for what austin know about
/// @message - the message that was sent in
///   * type
///   * channel
///   * user
///   * text
///   * ts
///   * team
let parse = function(webClient, context, message) {
  // get the channel and make sure that we're a member of the chanel
  let channel = message.channel;

  // FIXME - this method no longer exists. it can save time if we do this
  // if (!channel.is_member) {
  //   return;
  // }

  console.log(message);

  // for each listener, try to match the the message, and respond if succesful
  for (let id in listeners) {
    // get the listener
    let listener = listeners[id]

    // try to match the pattern for the listener. if there is a match, use the
    // listeners createResponse method, and send that response to the channel.
    let matched = listener.pattern.exec(message.text);
    if (matched) {
      listener.response(webClient, channel,  matched, context);
    }
  }
};

// list of listener object. each one needs to contain a regex pattern that will
// be matched and a function to generate a response.
let listeners = [
  // listener responsible for hearing "stats <player_name>" and responding with
  // the stats for that players season to date
  {
    pattern: re(/^stats (:<player>.*)/i),
    response: function(webClient, channel, matched, context) {
      // create an empty response and get the players name from the match
      let response;
      let playerName = matched.captures.player[0];

      // run the nba request for player stats, and reply when it completes
      nbaRequest.getPlayerStatsV2(playerName, function(err, data) {
        if (err) {
          response = err.message;
        }
        if (data) {
          let fgm = data.stats['fgm'];
          let fga = data.stats['fga'];
          let fgPct = data.stats['fgPct'];
          let fG3M = data.stats['fG3M'];
          let fG3A = data.stats['fG3A'];
          let fg3Pct = data.stats['fg3Pct'];
          let ftm = data.stats['ftm'];
          let fta =  data.stats['fta'];
          let ftPct = data.stats['ftPct'];
          let oreb = data.stats['oreb'];
          let dreb = data.stats['dreb'];
          let reb = data.stats['reb'];
          let ast = data.stats['ast'];
          let stl = data.stats['stl'];
          let blk = data.stats['blk'];
          let tov = data.stats['tov'];
          let pf = data.stats['pf'];
          let pts = data.stats['pts'];

          // set the text string to post.
          let response =
            data.player.fullName + " `" + pts + " ppg`\n" +
            "\t`fg: " + fgm + "/" + fga + "`  `" + fgPct + "%`\n" +
            "\t`3fg: " + fG3M + "/" + fG3A + "` `" + fg3Pct + "%`\n" +
            "\t`ft: " + ftm + "/" + fta + "` `" + ftPct + "%`\n" + 
            "\t" + reb + "reb | " + ast + "ast | " + stl + "stl | " + blk +
            "blk | " + tov + "tov";

          // set options for how to post the message
          let messageOpts = { as_user: true };

          // use the client to post the message
          webClient.chat.postMessage(channel, response, messageOpts);
        }
      });
    }
  },

  // listener responsible for hearing '.games' and posting all of tonights games
  // as they are in the context
  {
    pattern: re(/^\.games$/ig),
    response: function(channel, matched, context) {
      // setup options for sending the message
      let messageOpts = {
        as_user: true // post the message as austin
      };

      /* TODO(setup context here)
      // send message if no games are scheduled
      if (Object.keys(context.games).length === 0) {
        let response = "There are no scheduled games today :frowning:";
        webClient.chat.postMessage(channel, response, messageOpts);

      // print out a message for each of todays games
      } else {
        // function that takes a score and turns it into a useable string
        let stringify = function(score) {
          if (!score) { return '--'; }
          let string = String(score);

          if (string.length === 0) { return '--'; } 
          if (string.length === 1) { return '0' + string; }
          if (string.length > 1) { return string; }
        };

        // function that takes an optional tv network and returns an empty strin
        // or the network name with a space in front of it for printing.
        let network = function(tv) {
          if (!tv) { return ''; }
          return ' ' + tv;
        };

        // for each game, post the scores out as a new message
        for (let n in context.games) {
          // get this game, the road stats, and the home stats
          let game = context.games[n];
          let roadStats = game.roadStats;
          let homeStats = game.homeStats;

          // game status id: 1 - the game has yet to start
          // game status id: 2 - the game is being played
          // game status id: 3 - the game is over
          if (game.statusId === 1) {
            let response =
                '```' + game.roadNick + ' @ ' + game.homeNick + ' (' +
                game.statusText + network(game.tv) + ')```';
            webClient.chat.postMessage(channel, response, messageOpts);
          } else {
            let response =
                '```' + game.roadNick + ' ' + stringify(roadStats.ptsQtr1) +
                '|' + stringify(roadStats.ptsQtr2) + '|' +
                stringify(roadStats.ptsQtr3) + '|' +
                stringify(roadStats.ptsQtr4) + '  ' + stringify(roadStats.pts) +
                ' ' + game.statusText + '\n' + game.homeNick + ' ' +
                stringify(homeStats.ptsQtr1) + '|' +
                stringify(homeStats.ptsQtr2) + '|' +
                stringify(homeStats.ptsQtr3) + '|' +
                stringify(homeStats.ptsQtr4) + '  ' + stringify(homeStats.pts)
                + '```';
            webClient.chat.postMessage(channel, response, messageOpts);
          }
        }
      }
      */
    }
  }
];

module.exports = {
  parse: parse
};
