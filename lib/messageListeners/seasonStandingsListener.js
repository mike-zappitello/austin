"use strict";

let listener   = require('./listener').listener,
    q          = require('q');

let standingsListener = function(resources) {
  let that = listener();
  that.name = 'player_stats';

  that.handle = (text) => {
    if (text == null) return null;

    let args = text.split(' ');
    let command = args[0].toLowerCase();
    if (command !== "standings") return null;

    let mode = { conference: "both", topEight: true };
    for (let i in args) {
      let arg = args[i].toLowerCase();
      if (arg === "east") mode.conference = "east";
      if (arg === "west") mode.conference = "west";
      if (arg === "all") mode.topEight = false;
    }

    return mode;
  };

  that.composeResponse = (info, resources, postMessage) => {
    // run the nba request for player stats, and reply when it completes
    resources.nbaRequest.getStandings()
    .then((standings) => {
        let east, west;
        switch (info.conference) {
          case "east":
            east = true; west = false; break;
          case "west":
            west = true; east = false; break;
          case "both":
            west = true; east = true; break;
        }
        let eastLines = east ? [ "*East*" ] : [ ];
        let westLines = west ? [ "*West*" ] : [ ];

        let numTeams = info.topEight ? 8 : 15;
        for (let i = 0; i < numTeams; i++) {
          if (east) {
            let tEast = standings.east[i];
            eastLines.push(`${i + 1}. ${tEast.teamCity} ${tEast.teamName}`);
          }
          if (west) {
            let tWest = standings.west[i];
            westLines.push(`${i + 1}. ${tWest.teamCity} ${tWest.teamName}`);
          }
        }

        postMessage(eastLines.join("\n") + "\n" + westLines.join("\n"));
    }).catch((err) => {
        postMessage(`Encountered An Error: ${err}`);
    });
  };

  return that;
};

module.exports = { listener: standingsListener };
