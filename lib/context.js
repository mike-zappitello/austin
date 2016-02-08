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
      nick: teamDict.abbreviation,
      teamName: teamDict.teamName,
      simpleName: teamDict.simpleName,
      location: teamDict.location
    };
  }

  /// ~~~ PRIVATE METHODS ~~~ ///

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

  /// get the game that a team is playing in
  ///
  /// @nick(string) - a teams nickname in all capitals
  /// @returns - the game dictionary this team is playing in or null
  let getGameFromTeamNick = function(nick) {
    for (let id in that.games) {
      let game = that.games[id];
      // TODO - make this case insensitive (make everythign all lower case?
      if (nick === game.homeNick || nick === game.roadNick) {
        return game;
      }
    }
  }

  /// ~~~ PUBLIC METHODS ~~~ ///

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
  that.updateGames = function(gameData) {
    // get all of the score data for each game. save it based on team id
    let lineScores = [];
    for (let i in gameData.lineScore) {
      let score = gameData.lineScore[i];

      lineScores[score.teamId] = {
       ptsQtr1: score.ptsQtr1,
       ptsQtr2: score.ptsQtr2,
       ptsQtr3: score.ptsQtr3,
       ptsQtr4: score.ptsQtr4,
       ptsOt1: score.ptsOt1,
       ptsOt2: score.ptsOt2,
       ptsOt3: score.ptsOt3,
       ptsOt4: score.ptsOt4,
       ptsOt5: score.ptsOt5,
       ptsOt6: score.ptsOt6,
       ptsOt7: score.ptsOt7,
       ptsOt8: score.ptsOt8,
       ptsOt9: score.ptsOt9,
       ptsOt10: score.ptsOt10,
       pts: score.pts,
       fgPct: score.fgPct,
       ftPct: score.ftPct,
       fg3Pct: score.fg3Pct,
       ast: score.ast,
       reb: score.reb,
       tov: score.tov
      };
    }

    for (let i in gameData.gameHeader) {
      let game = gameData.gameHeader[i];

      that.games[game.gameId] = {
        statusId: game.gameStatusId,
        statusText: game.gameStatusText,
        homeTeam: game.homeTeamId,
        homeNick: that.teams[game.homeTeamId].nick,
        homeStats: lineScores[game.homeTeamId],
        roadTeam: game.visitorTeamId,
        roadNick: that.teams[game.visitorTeamId].nick,
        roadStats: lineScores[game.visitorTeamId],
        tv: game.natlTvBroadcasterAbbreviation,
      };
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
};
