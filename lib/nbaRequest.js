"use strict";

let nba = require('nba').usePromises();

let getPlayerStats = function (playerName, callback) {
  let players = nba.findPlayers(playerName);

  // if we couldn't find the player, pass an error to the callback and exit
  if (players.length < 1) {
      let error = new Error("Unable to find player `" + playerName + '`.');
      callback(error, null);
      return;
  }

  for (let id in players) {
    // lol
    let request = {playerId: players[id].playerId};

    nba.stats.playerInfo(request, function (err, response) {
      if (response) {
        callback(null, response.playerHeadlineStats[0]);
      }

      if (err) {
        callback(err, null);
      }
    });
  }
};

let getPlayerVuStats = function (type, player, callback) {
  // if we couldn't find the player, pass an error to the callback and exit
  if (!player) {
      let error = new Error("Unable to find player `" + playerName + '`.');
      callback(error, null);
      return;
  }

  let request = { };

  // i don't think this is done on the other end yet?
  nba.statsVu.rebounding(request, function(err, response) {
    if (response) {
      callback(null, response.playerHeadlineStats[0]);
    }

    if (err) {
      callback(err, null);
    }
  });
};

let getTodaysGames = function (gameDate, callback) {
  let request = {gameDate: gameDate};

  nba.stats.scoreboard(request, function (err, response) {
    if (err) {
      callback(err, null);
    } else if (response) {
      callback(null, response);
    }
  });
}

module.exports = {
  getPlayerStats : getPlayerStats,
  getTodaysGames : getTodaysGames,
  getPlayerVuStats : getPlayerVuStats
}
