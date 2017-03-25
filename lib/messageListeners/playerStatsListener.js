"use strict";

const listener  = require('./listener').listener;
const nbaRequest = require('../nbaRequest');
const q = require('q');
const re = require('named-regexp').named;

const createMessage = (client, channel, message) => {
    let defered = q.defer();

    const callback = (err, info) => {
        if (err) defered.reject(err);
        else defered.resolve(info);
    };

    client.chat.postMessage(channel, message, { as_user: true }, callback);

    return defered.promise;
}

const formatStats = (stats, playerName) => {
    let fgm = stats['fgm'];
    let fga = stats['fga'];
    let fgPct = (Number(stats['fgPct']) * 100).toFixed(1);
    let fG3M = stats['fG3M'];
    let fG3A = stats['fG3A'];
    let fg3Pct = (Number(stats['fg3Pct']) * 100).toFixed(1);
    let ftm = stats['ftm'];
    let fta =  stats['fta'];
    let ftPct = (Number(stats['ftPct']) * 100).toFixed(1);
    let oreb = stats['oreb'];
    let dreb = stats['dreb'];
    let reb = stats['reb'];
    let ast = Number(stats['ast']);
    let stl = stats['stl'];
    let blk = stats['blk'];
    let tov = Number(stats['tov']);
    let pf = stats['pf'];
    let pts = stats['pts'];
    let to_ast = (tov / ast).toFixed(2);

    // create strings for all the stat lines we're going to display
    let lines = [
        "*" + playerName + "*",
        "`" + pts + " ppg`",
        ":basketball: `" + fgm + "/" + fga + "|" + fgPct+ "%`",
        ":raised_hands: `" + fG3M + "/" + fG3A + "|" + fg3Pct + "%`",
        ":free: `" + ftm + "/" + fta + "|" + ftPct + "%`",
        "`" + tov + "to/" + ast + "ast|" + to_ast + "`",
        "`" + reb + "reb` `" + stl + "stl` `" + blk + "blk`"
    ];

    let salary = nbaRequest.getSalary(playerName);
    if (salary) {
        lines.push(":moneybag: `$" + salary.toLocaleString() + "`");
    }

    return lines.join("\n");
};

const postPlayerStats = (client, channel, player) => {
    // create a promise to post a message, it resolves to the message ts.
    const lookingMessage = "Looking up stats for " + player.firstName + ' ' +
                           player.lastName;
    const messagePromise = createMessage(client, channel, lookingMessage);

    // create a promise to get the stats for the player.
    const statsPromise = nbaRequest.getPlayerStats(player)
    .then((stats) => {
        messagePromise.then((messageInfo) => {
            // pull the time stamp out of the message info
            const ts = messageInfo.ts;
            // use the stats recieved to generate string to send to slack
            const statsMessage = formatStats(
                stats.overallPlayerDashboard[0], player.fullName);
            // update the origional message with the new stats string 
            client.chat.update(ts, channel, statsMessage, { as_user: true});
        });
    });
}

let playerStatsListener = function(resources) {
  let that = listener();
  that.name = 'player_stats';

  // setup a function to handle the a message
  that.handle = function(text) {
    let matched = re(/^stats (:<player>.*)/i).exec(text);

    if (matched) { return { player: matched.captures.player[0] }; }
    else { return null; }
  };

  // setup a function to build a response to a request
  that.composeResponse = function(info, webClient, channel) {
    // get all the players matching this name and post their stats to the chanel
    const players = nbaRequest.findPlayers(info.player);
    players.forEach((player) => postPlayerStats(webClient, channel, player));
  };

  return that;
};

module.exports = { listener: playerStatsListener };
