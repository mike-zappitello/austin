"use strict";

let re         = require('named-regexp').named,
    nbaRequest = require('./../nbaRequest'),
    listener   = require('./listener').listener,
    q          = require('q');

let playerStatsListener = function(logger) {
  let that = listener(logger);

  that.name = 'player_stats';

  that.handle = function(text) {
    let matched = re(/^stats (:<player>.*)/i).exec(text);

    if (matched) { return { player: matched.captures.player[0] }; }
    else { return null; }
  }

  that.composeResponse = function(info, callback) {
    // run the nba request for player stats, and reply when it completes
    let playerStatsPromises = nbaRequest.getPlayerStats(info.player);
    q.allSettled(playerStatsPromises)
    .then(function(results) {
      results.forEach(function (result) {
        let info = result.value;
        let stats = info.overallPlayerDashboard[0];

        let fgm = stats['fgm'];
        let fga = stats['fga'];
        let fgPct = stats['fgPct'];
        let fG3M = stats['fG3M'];
        let fG3A = stats['fG3A'];
        let fg3Pct = stats['fg3Pct'];
        let ftm = stats['ftm'];
        let fta =  stats['fta'];
        let ftPct = stats['ftPct'];
        let oreb = stats['oreb'];
        let dreb = stats['dreb'];
        let reb = stats['reb'];
        let ast = stats['ast'];
        let stl = stats['stl'];
        let blk = stats['blk'];
        let tov = stats['tov'];
        let pf = stats['pf'];
        let pts = stats['pts'];

        // set the text string to post.
        let response =  
          info.player.fullName + " `" + pts + " ppg`\n" +
          "\t`fg: " + fgm + "/" + fga + "`  `" + fgPct + "%`\n" +
          "\t`3fg: " + fG3M + "/" + fG3A + "` `" + fg3Pct + "%`\n" +
          "\t`ft: " + ftm + "/" + fta + "` `" + ftPct + "%`\n" + 
          "\t" + reb + "reb | " + ast + "ast | " + stl + "stl | " + blk +
          "blk | " + tov + "tov";

        callback(response);
      });
    }).catch(function(error) { callback(error); });
  };

  return that;
};

module.exports = { listener: playerStatsListener };
