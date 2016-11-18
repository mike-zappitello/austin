"use strict";

let nba = require('nba'),
    q   = require('q');

// info on stast enpoints -
// https://github.com/nickb1080/nba/blob/master/doc/stats.md

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
      return q.reject(error);
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

let getStandings = function (args) {
  let teams = nba.teams;
  let standings = { east: [ ], west: [ ] };

  // use reduce to create a chain of promises using the teams array
  // http://stackoverflow.com/a/17764496
  return teams.reduce(
    // @chain - the promise chain we're building up
    // @team - the next team in teams we're setting up a promise for
    (chain, team) => {
      // return the chain with a promise for the current team added to the end
      return chain.then((pteamInfo) => {
        // add the result of this promise to our standings lists
        if (pteamInfo) {
          // derp - thanks for the formatting nba.com
          let info = pteamInfo.teamInfoCommon[0];

          // add team to standings depending on conference
          if (info.teamConference === "East")
            standings.east.push(info);
          if (info.teamConference === "West")
            standings.west.push(info);
        }
      
        // create the next promise and return it
        return nba.stats.teamInfoCommon( { 
          Season: "2015-16",
          SeasonType: "Regular Season",
          TeamID: String(team.teamId)
        });
      });
    },
    // this is the chain to start with.
    q.resolve()
  ).then(() => {
    // setup a sort function between two teams and use it to sort standings
    let standingsSort = (a, b) => { return a.confRank - b.confRank; };
    standings.east.sort(standingsSort);
    standings.west.sort(standingsSort);

    return standings;
  });
};


module.exports = {
  findPlayers,
  getPlayerStats,
  getStandings
}
