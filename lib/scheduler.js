/// Contains the logic for scheduling different tasks
///
/// Exports: scheduleDailyGames

"use strict";

let cron = require('node-schedule'),
    nba_request = require('./nba_request');

/// start requesting the games from nba dot com
///
/// @callback(err, games) - what to do with the games and how to handle an error
let scheduleDailyGames = function(callback) {
  console.log("Scheduling Daily Games Task");
  // setup the policy for when we want to run this method
  let policy = {
    hour : 15, 
    minute : 30
  };

  let task = function() {
    nba_request.getTodaysGames(function(err, games) {
      if (err) {
        console.log("error: " + err.message);
        callback(error, null);
      } else if (games) {
        callback(null, games);
      }
    })
  };

  let job = cron.scheduleJob('get todays games', policy, task);

  // TODO we can call job.schedule(newPolicy) on this job to change how
  // frequently we're polling this game (e.g. only after the first game starts)
}

module.exports = {
  scheduleDailyGames : scheduleDailyGames
}
