/// Contains the logic for scheduling different tasks
///
/// Exports:
///   * watchGames 
///   * nightlyCleanup

"use strict";

let cron = require('node-schedule'),
    nbaRequest = require('./nbaRequest');

/// start watching all the games that are being played today.
///
/// @nbaContext - a nbaContext object that we will store the daily games.
/// @returns - the watchGames job that was scheduled
let watchGames = function(nbaContext) {
  console.log("starting 'watch todays games' job");

  // setup the policy for when we want to run this method
  let policy = {
    hour : [new cron.Range(0, 24)]
  };

  let task = function() {
    nbaRequest.getTodaysGames(nbaContext.gamesDate(), function(err, games) {
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

/// schedule a nightly cleanup of the nbaContext
///
/// @nbaContext - the nba context that will be cleaned up
/// @returns - the 'nigtly cleanup' job that was shceduled
let nightlyCleanup = function(nbaContext) {
  console.log("starting 'nightly cleanup' job");

  // the server is 7 hours ahead of EST, this policy is for 3am EST
  // TODO figure out a global place to store the server time offset
  let policy = {
    hour: 10,
    minute: 0
  }

  let job = cron.scheduleJob('nightly cleanup', policy, nbaContext.cleanup);
  return job;
}

module.exports = {
  watchGames : watchGames,
  nightlyCleanup : nightlyCleanup
}
