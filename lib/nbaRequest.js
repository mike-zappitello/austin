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

/// Get the advanced player stats for the current season
/// @playerName - a string of a players name (e.g. lebron, love, mike)
/// @callback
let getPlayerStatsV2 = function (playerName, callback) {
  let players = nba.findPlayers(playerName);

  // if we couldn't find the player, pass an error to the callback and exit
  if (players.length < 1) {
      let error = new Error("Unable to find player `" + playerName + '`.');
      callback(error, null);
      return;
  }

  for (let id in players) {
    // lol
    let request = { playerId: players[id].playerId };

    nba.stats.playerProfileV2(request, function (err, response) {
      if (response) {
        for (let n in response.seasonTotalsRegularSeason) {
          let season = response.seasonTotalsRegularSeason[n];
          if (season.seasonId === '2015-16') {
            let data = {
              player: players[id],
              stats: season
            };
            callback(null, data); 
          }
        }
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
  getPlayerStatsV2 : getPlayerStatsV2,
  getTodaysGames : getTodaysGames,
  getPlayerVuStats : getPlayerVuStats
}
