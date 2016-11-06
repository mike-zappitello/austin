"use strict";

let nba = require('nba');

/// Return an array of player objects from a players name
///
/// TODO(mike) - this search currently returns all names that include the passed
/// in @playerName in the players full name. it works pretty well, but messes up
/// when you misspell a persons name. i would like to pass in a @searchMode
/// parameter as well to settup different types of searching.
let findPlayers = function(playerName) {
  // get the players from the nba module and setup a matches array
  let players = nba.players;
  let matches = [ ];

  // this is the part where we would do a switch based on a serch mode
  for (let id in players) {
    let p = players[id];
    if (p.fullName.toLowerCase().includes(playerName.toLowerCase())) {
      matches.push(p);
      // logging?
    }
  }

  return matches;
}

let getPlayerStats = function (playerName) {
  let players = findPlayers(playerName);

  // if we couldn't find the player, pass an error to the callback and exit
  if (players.length < 1) {
      let error = new Error("Unable to find player `" + playerName + '`.');
      callback(error, null);
      return;
  }

  let promises = [ ];

  for (let id in players) {
    // lol
    let request = { PlayerID: players[id].playerId };
    let promise = nba.stats.playerSplits(request)
      .then(function(data) {
        data.player = players[id];
        return data;
      });
    promises.push(promise);
  }

  return promises;
};


module.exports = {
  findPlayers: findPlayers,
  getPlayerStats : getPlayerStats
}
