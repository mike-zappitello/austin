"use strict";

let listener   = require('./listener').listener,
    q          = require('q');

let standingsListener = function(resources) {
  let that = listener();
  that.name = 'player_stats';

  that.handle = (text) => {
    let args = text.split(' ');

    if (args[0] !== "standings") return null;
    return { mode: "all" };
  };

  that.composeResponse = (info, resources, postMessage) => {
    // run the nba request for player stats, and reply when it completes
    resources.nbaRequest.getStandings()
    .then((standings) => {
        let eastLines = [ "*East*" ];
        let westLines = [ "*West*" ];

        for (let i = 0; i < 8; i++) {
          let tEast = standings.east[i];
          let tWest = standings.west[i];
          eastLines.push(`${i + 1}. ${tEast.teamCity} ${tEast.teamName}`);
          westLines.push(`${i + 1}. ${tWest.teamCity} ${tWest.teamName}`);
        }

        postMessage(eastLines.join("\n") + "\n" + westLines.join("\n"));
    }).catch((err) => {
        postMessage(`Encountered An Error: ${err}`);
    });
  };

  return that;
};

module.exports = { listener: standingsListener };
