/// Contains the logic for storing / saving the context for austin
///
/// Exports: context

"use strict";

let fs = require('fs'),
    nba = require('nba').usePromises();

let context = function() {
  let that = {};
  that.teams = {};

  // convert the array of teams into a dict of teams. its easier to manipulate
  // this way.
  for (let team in nba.teams) {
    let teamDict = nba.teams[team];
    that.teams[teamDict.teamId] = {
      abbreviation: teamDict.abbreviation,
      teamName: teamDict.teamName,
      simpleName: teamDict.simpleName,
      location: teamDict.location
    };
  }

  let updateTeamStanding = function(teamStanding) {
    // get the team for this standing
    let team = that.teams[teamStanding.teamId];

    // update the team
    team.wins = teamStanding.w;
    team.losses = teamStanding.l;
    team.homeRecord = teamStanding.homeRecord;
    team.roadRecord = teamStanding.roadRecord;
  };

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

  return that;
};

module.exports = {
  context: context 
}
