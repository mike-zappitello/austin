"use strict";

let re = require('named-regexp').named,
    nbaRequest = require('./../nbaRequest');

let pattern = re(/^stats (:<player>.*)/i);

let name = 'player_stats';

let response = function(webClient, channel, matched, context) {
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
};

module.exports = { pattern, response };
