/// Contains the logic for storing / saving the context for austin
///
/// Exports: context

"use strict";

let fs = require('fs'),
    nba = require('nba').usePromises();

let context = function() {
  // object representing the data of the context
  let that = {};

  // objects stored inside of the context
  that.teams = {};
  that.games = {};

  // convert the array of teams into a dict of teams. its easier to manipulate
  // this way.
  //
  // TODO - pull in other sources of information about the teams - color, emoji
  // symbol, etc.
  for (let team in nba.teams) {
    let teamDict = nba.teams[team];
    that.teams[teamDict.teamId] = {
      abbreviation: teamDict.abbreviation,
      teamName: teamDict.teamName,
      simpleName: teamDict.simpleName,
      location: teamDict.location
    };
  }

  /// update the wins and losses for a ream in teams dict
  ///
  /// @teamStanding - information on how a single team is doing
  ///   * teamId - unique key identifying team in teams dict
  ///   * wins, losses - total number of wins and losses team has
  ///   * homeRecord, roadRecord - formatted home and road records (4-2)
  let updateTeamStanding = function(teamStanding) {
    // get the team for this standing
    let team = that.teams[teamStanding.teamId];

    // update the team
    team.wins = teamStanding.w;
    team.losses = teamStanding.l;
    team.homeRecord = teamStanding.homeRecord;
    team.roadRecord = teamStanding.roadRecord;
  };

  /// update the standings for all teams
  ///
  /// eStandings, wStandings - collections of team standings for each 
  ///   conference. each team standing should work as an argument in
  ///   updateTeamStanding.
  that.updateStandings = function(eStandings, wStandings) {
    // update the east
    for (let standing in eStandings) {
      updateTeamStanding(eStandings[standing]);
    }

    // update the west
    for (let standing in wStandings) {
      updateTeamStanding(wStandings[standing]);
    }
  };

  /// update todays games using a list of game objects
  that.updateGames = function(gameHeaders) {
    for (let i in gameHeaders) {
      let game = gameHeaders[i];

      that.games[game.gameId] = {
        statusId: game.gameStatusId,
        statusText: game.gameStatusText,
        homeTeam: game.homeTeamId,
        roadTeam: game.visitorTeamId,
        tv: game.natlTvBroadcasterAbbreviation,
      };

      // logging for status / status test so i can look at it later and figure
      // stuff out
      if (game.gameId === '0021500769') {
        console.log(that.games[game.gameId]);
      }
    }
  };

  /// get the day string that we want to use when polling for todays games
  ///
  /// our server is ahead by 7 hours and we want to poll yesterdays games up
  /// until 3am so we don't cut off last nights games
  that.gamesDate = function() {
    let now = new Date();
    if (now.getHours() < 10) {
      now.setDate(now.getDate()-1);
    }

    // TODO, burry these in Date object
    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    let today = month + "/" + day + "/" + now.getFullYear().toString();

    return today;
  };

  /// cleanup todays games so we aren't growing a list every day.
  that.cleanup = function() {
    that.games = {};
  }

  return that;
};

module.exports = {
  context: context 
}
