"use strict";

// NOTES:
// things i deleted from games.json:
// { gameDateEst: '2016-02-04T00:00:00',

// games consists of:
// gameHeader
//    list of games - sequence, id, status id, code, home / away team ids, live
//    period / pctime, national tv broadcast, whstatus
// lineScore
//    list of teams playing tonight and how they are doing tonight
// seriesStandings
// lastMeeting
// eastConfStandingsByDay & westConfStandingsByDay
//    ordered lists of teams in each conferences
// available
//    game id and pt available?

let fs = require('fs');

let andThen = function(err, data) {
  if (err) {
    console.log('damn');
  }
  if (data) {
    let gameData = JSON.parse(data);
    console.log(gameData.available);
  }
}

fs.readFile('./games.json', andThen);
