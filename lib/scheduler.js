/// Contains the logic for scheduling different tasks
///
/// Exports: watchGames 

"use strict";

let cron = require('node-schedule'),
    nba_request = require('./nba_request');

/// start watching all the games that are being played today.
///
/// @nbaContext - a nbaContext object that we will store the daily games.
let watchGames = function(nbaContext) {
  console.log("starting 'watch todays games' job");

  // setup the policy for when we want to run this method
  let policy = {
    hour : 18
  };

  let task = function() {
    nba_request.getTodaysGames(nbaContext.gamesDate(), function(err, games) {
      if (err) {
        console.log("error: " + err.message);
      } else if (games) {
        nbaContext.updateGames(games);
      }
    });
  };

  let job = cron.scheduleJob('watch todays games', policy, task);

  // TODO we can call job.schedule(newPolicy) on this job to change how
  // frequently we're polling this game (e.g. only after the first game starts)
  return job;
}

module.exports = {
  watchGames : watchGames
}
