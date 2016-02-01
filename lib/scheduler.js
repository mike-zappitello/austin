/// Contains the logic for scheduling different tasks
///
/// Exports:

"use strict";

let cron = require('node-schedule'),
    nba_request = require('./nba_request');

let scheduleDailyGames = function(callback) {
  //*
  console.log("Scheduling Daily Games Task");
  // setup the policy for when we want to run this method
  let policy = {
    hour: 14, 
    minute: 0
  };

  // create the tesk, run getTodaysGames based on the policy. writing out its
  // results to the callback
  let task = cron.scheduleJob(
      policy,  nba_request.getTodaysGames(callback));
  // */

  /* 
  nba_request.getTodaysGames(function(err, games) {
    if (err) {
      console.log("error: " + err.message);
      callback(error, null);
    } else if (games) {
      callback(null, games);
    }
  });
  */
}

module.exports = {
  scheduleDailyGames : scheduleDailyGames
}
