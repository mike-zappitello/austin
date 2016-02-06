"use strict";

let nba = require('nba').usePromises();

let getTeamNameFromId = function (id) {
  for (let n in nba.teams) {
    if (nba.teams[n].teamId === id) {
      return nba.teams[n];
    }
  }
  console.log("unable to find team id: " + id);
}

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

let getTodaysGames = function (callback) {
  let date = new Date();

  // todo, burry these in Date object
  let day = ("0" + date.getDate()).slice(-2);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let today = month + "/" + day + "/" + date.getFullYear().toString();

  // console.log("today: " + today);
  let request = {gameDate: today};

  nba.stats.scoreboard(request, function (err, response) {
    if (err) {
      callback(err, null);
    } else if (response) {
      let gameHeaders = response.gameHeader;

      // todo - i think htis is supposed to be an array object
      let games = [];

      for (let i in gameHeaders) {
        let game = {
          // write a function to get the teams
          hometeam: getTeamNameFromId(gameHeaders[i].homeTeamId),
          awayteam: getTeamNameFromId(gameHeaders[i].visitorTeamId),
          network: gameHeaders[i].natlTvBroadcasterAbbreviation,
          status: gameHeaders[i].gameStatusText
        }
        games.push(game);
      }

      callback(null, games);
    }
  });
}

module.exports = {
  getPlayerStats : getPlayerStats,
  getTodaysGames : getTodaysGames,
  getPlayerVuStats : getPlayerVuStats
}
