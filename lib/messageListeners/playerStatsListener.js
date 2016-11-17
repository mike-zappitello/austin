"use strict";

let re         = require('named-regexp').named,
    listener   = require('./listener').listener,
    q          = require('q');

let playerStatsListener = function(resources) {
  let that = listener();
  that.name = 'player_stats';

  that.handle = function(text) {
    let matched = re(/^stats (:<player>.*)/i).exec(text);

    if (matched) { return { player: matched.captures.player[0] }; }
    else { return null; }
  }

  that.composeResponse = function(info, resources, postMessage) {
    // run the nba request for player stats, and reply when it completes
    let statsPromises = resources.nbaRequest.getPlayerStats(info.player);

    q.allSettled(statsPromises)
    .then(function(results) {
      results.forEach(function (result) {
        let info = result.value;
        let stats = info.overallPlayerDashboard[0];

        let fgm = stats['fgm'];
        let fga = stats['fga'];
        let fgPct = (Number(stats['fgPct']) * 100).toFixed(1);
        let fG3M = stats['fG3M'];
        let fG3A = stats['fG3A'];
        let fg3Pct = (Number(stats['fg3Pct']) * 100).toFixed(1);
        let ftm = stats['ftm'];
        let fta =  stats['fta'];
        let ftPct = (Number(stats['ftPct']) * 100).toFixed(1);
        let oreb = stats['oreb'];
        let dreb = stats['dreb'];
        let reb = stats['reb'];
        let ast = Number(stats['ast']);
        let stl = stats['stl'];
        let blk = stats['blk'];
        let tov = Number(stats['tov']);
        let pf = stats['pf'];
        let pts = stats['pts'];
        let to_ast = (tov / ast).toFixed(2);

        // set the text string to post.
        let response =  
          info.player.fullName + "\n" +
          "`" + pts + " ppg`\n" +
          ":basketball: `" + fgm + "/" + fga + "|" + fgPct+ "%`\n" +
          ":free: `" + fG3M + "/" + fG3A + "|" + fg3Pct + "%`\n" +
          ":three: `" + ftm + "/" + fta + "` `" + ftPct + "%`\n" +
          tov + "to/" + ast + "ast|" + to_ast + "\n" +
          "`" + reb + "reb``" + stl + "stl``" + blk + "blk``";

        postMessage(response);
      });
    }).catch(function(error) { postMessage(error); });
  };

  return that;
};

module.exports = { listener: playerStatsListener };
