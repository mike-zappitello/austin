"use strict";

let nba = require('nba').usePromises();

let getPlayerStats = function (playerName, callback) {
  let player = nba.findPlayer(playerName);

  // if we couldn't find the player, pass an error to the callback and exit
  if (!player) {
      let error = new Error("Unable to find player `" + playerName + '`.');
      callback(error, null);
      return;
  }

  let request = {playerId: player.playerId};

  nba.stats.playerInfo(request, function (err, response) {
    if (response) {
      callback(null, response.playerHeadlineStats[0]);
    }

    if (err) {
      callback(err, null);
    }
  });
};

module.exports = {
  getPlayerStats : getPlayerStats
}
