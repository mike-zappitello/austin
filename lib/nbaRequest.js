"use strict";

const nba = require('nba'),
    q   = require('q');

// info on stast enpoints -
// https://github.com/nickb1080/nba/blob/master/doc/stats.md

/// Return an array of player objects from a players name
///
/// TODO(mike) - this search currently returns all names that include the passed
/// in @playerName in the players full name. it works pretty well, but messes up
/// when you misspell a persons name. i would like to pass in a @searchMode
/// parameter as well to settup different types of searching.
const findPlayers = function(playerName) {
  // get the players from the nba module and setup a matches array
  const players = nba.players;
  const matches = [ ];

  // this is the part where we would do a switch based on a serch mode
  for (const id in players) {
    const p = players[id];
    if (p.fullName.toLowerCase().includes(playerName.toLowerCase())) {
      matches.push(p);
    }
  }

  return matches;
};

const getSalary = function(playerName) {
    const players = require('../data/salaries.json');

    for (const id in players) {
        const p = players[id];
        if (p.name.toLowerCase().includes(playerName.toLowerCase())) {
            return p.salary;
        }
    }
};

const getPlayerStats = function (player) {
    const requestInfo = { PlayerID: player.playerId };
    return nba.stats.playerSplits(requestInfo);
};

const getStandings = function (args) {
  const teams = nba.teams;
  const standings = { east: [ ], west: [ ] };

  /// add a team to the standings
  const addToStandings = (teamInfo) => {
    if (!teamInfo) return;

    // derp - thanks for the formatting nba.com
    const info = teamInfo.teamInfoCommon[0];

    // add team to standings depending on conference
    if (info.teamConference === "East")
      standings.east.push(info);
    if (info.teamConference === "West")
      standings.west.push(info);
  }

  // use reduce to create a chain of promises using the teams array
  // http://stackoverflow.com/a/17764496
  return teams.reduce(
    // @chain - the promise chain we're building up
    // @team - the next team in teams we're setting up a promise for
    (chain, team) => {
      // return the chain with a promise for the current team added to the end
      return chain.then((pteamInfo) => {
        // add the result of this promise to our standings lists
        addToStandings(pteamInfo);
      
        // create the next promise and return it
        return nba.stats.teamInfoCommon( { 
          Season: "2017-18",
          SeasonType: "Regular Season",
          TeamID: String(team.teamId)
        });
      });
    },
    // this is the chain to start with.
    q.resolve()
  ).then((lastTeamInfo) => {
    // add the result of the last promise to our standings lists
    addToStandings(lastTeamInfo);

    // setup a sort function between two teams and use it to sort standings
    const standingsSort = (a, b) => { return a.confRank - b.confRank; };
    standings.east.sort(standingsSort);
    standings.west.sort(standingsSort);

    return standings;
  });
};


module.exports = {
  findPlayers,
  getSalary,
  getPlayerStats,
  getStandings
}
