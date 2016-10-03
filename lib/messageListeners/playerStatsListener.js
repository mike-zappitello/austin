"use strict";

let re         = require('named-regexp').named,
    nbaRequest = require('./../nbaRequest'),
    listener   = require('./listener').listener;

let playerStatsListener = function(logger) {
  let that = listener(logger);

  that.name = 'player_stats';

  that.handle = function(text) {
    let matched = re(/^stats (:<player>.*)/i).exec(text);

    if (matched) { return { player: matched.captures.player[0] }; }
    else { return null; }
  }

  that.composeResponse = function(info, callback) {
    // create an empty response and get the players name from the match
    let response;

    // run the nba request for player stats, and reply when it completes
    nbaRequest.getPlayerStatsV2(info.player, function(err, data) {
      if (err) { response = err.message; }
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
        response =  
          data.player.fullName + " `" + pts + " ppg`\n" +
          "\t`fg: " + fgm + "/" + fga + "`  `" + fgPct + "%`\n" +
          "\t`3fg: " + fG3M + "/" + fG3A + "` `" + fg3Pct + "%`\n" +
          "\t`ft: " + ftm + "/" + fta + "` `" + ftPct + "%`\n" + 
          "\t" + reb + "reb | " + ast + "ast | " + stl + "stl | " + blk +
          "blk | " + tov + "tov";
      }

      callback(response, response);
    });
  };

  return that;
};

module.exports = { listener: playerStatsListener };
