/// Contains the logic for storing / saving the context for austin
///
/// Exports: context

"use strict";

let fs = require('fs'),
    nba = require('nba').usePromises();

let teams = {};

let initContext = function() {
  // TODO - don't have an array of team object, map it to teamId's
  for (let team in nba.teams) {
    let teamDict = nba.teams[team];
    teams[teamDict.teamId] = {
      abbreviation: teamDict.abbreviation,
      teamName: teamDict.teamName,
      simpleName: teamDict.simpleName,
      location: teamDict.location
    };
  }
};

// teamId: 12342135
// abbreviation: 'UTA'
// teamName: 'Utah Jazz'
// simpleName: 'Jazz'
// location 'Utah'

let updateTeamStanding = function(teamStanding) {
  // get the team for this standing
  let team = teams[teamStanding.teamId];

  // update the team
  team.wins = teamStanding.w;
  team.losses = teamStanding.l;
  team.homeRecord = teamStanding.homeRecord;
  team.roadRecord = teamStanding.roadRecord;
};

let updateStandings = function(eStandings, wStandings) {
  // update the east
  for (let standing in eStandings) {
    updateTeamStanding(eStandings[standing]);
  }

  // update the west
  for (let standing in wStandings) {
    updateTeamStanding(wStandings[standing]);
  }
}

module.exports = {
  teams: teams,
  initContext: initContext,
  updateStandings: updateStandings
}
