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
      
      if (game.gameId === '0021500769') {
        console.log(that.games[game.gameId]);
      }
    }
  };

  that.gamesDate = function() {
    let date = new Date();

    // TODO, burry these in Date object
    // TODO, switch the date based on time so that late night games still show
    // up ok.
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let today = month + "/" + day + "/" + date.getFullYear().toString();

    return today;
  };

  return that;
};

module.exports = {
  context: context 
}
