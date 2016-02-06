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
    for (let i in gameData.gameHeader) {
      let game = gameHeaders[i];

      that.games[game.gameId] = {
        statusId: game.gameStatusId,
        statusText: game.gameStatusText,
        homeTeam: game.homeTeamId,
        homeNick: that.teams[game.homeTeamId].nick,
        roadTeam: game.visitorTeamId,
        roadNick: that.teams[game.visitorTeamId].nick,
        tv: game.natlTvBroadcasterAbbreviation,
      };

      // logging for status / status test so i can look at it later and figure
      // stuff out
      if (game.gameId === '0021500769') {
        console.log(that.games[game.gameId]);
      }
    }

    for (let i in gameData.lineScore) {
      let lineScore = gameData.lineScore[i];
      let game = that.games[lineScore.gameId];
      if (game) {
        // TODO figure out how to store this data into the game
      } else {
        console.log(
            "Couldn't find game for team " + lineScore.gameId + '.');

      }
    }
    /* format for each member of 'lineScore'
    { "gameSequence": 1,
       "gameId": "0021500746",
       "teamId": 1610612752,
       "teamAbbreviation": "NYK",
       "teamCityName": "New York",
       "teamWinsLosses": "23-28",
       "ptsQtr1": null,
       "ptsQtr2": null,
       "ptsQtr3": null,
       "ptsQtr4": null,
       "ptsOt1": null,
       "ptsOt2": null,
       "ptsOt3": null,
       "ptsOt4": null,
       "ptsOt5": null,
       "ptsOt6": null,
       "ptsOt7": null,
       "ptsOt8": null,
       "ptsOt9": null,
       "ptsOt10": null,
       "pts": null,
       "fgPct": null,
       "ftPct": null,
       "fg3Pct": null,
       "ast": null,
       "reb": null,
       "tov": null }
    */
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
