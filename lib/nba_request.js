"use strict";

let nba = require('nba').usePromises();

let getPlayerStats = function (playerName, callback) {
  let player = nba.findPlayer(playerName);
  let request = {playerId: player.playerId};

  nba.stats.playerInfo(request, function (err, response) {
    if (response) {
      callback(response.playerHeadlineStats[0]);
    }
    if (err) {
      console.log(
          "error when getting player stats for " + playerName  + ":\n" + error);
    }
  });
};

module.exports = {
  getPlayerStats : getPlayerStats
}
