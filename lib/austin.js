"use strict";

const botkit = require('botkit');
const controller = botkit.slackbot();

const nbaRequest = require('./nbaRequest');
const formatter = require('./formatter');

const Austin = configuration => {
  const bot = controller.spawn( { token: configuration.slackToken } );

  function start_rtm() {
    bot.startRTM((err, bot, payload) => {
      if (err) {
        console.log('Failed to start RTM')
        return setTimeout(start_rtm, 60000);
      }

      console.log("RTM started!");
    });
  }

  controller.on('rtm_close', (bot, err) => { start_rtm(); });

  start_rtm();

  // --------------------- //
  // Player Stats Listener //
  // --------------------- //
  controller.hears(/stats\s+(.*)/i, [ 'ambient' ], (bot, msg) => {
    const player_name = msg.match[1];
    const players = nbaRequest.findPlayers(player_name);

    // create a different response for each player that matches the name
    for (const i in players) {
      const player = players[i];
      const initial_response = "Looking up stats for " + player.fullName;

      // send the initial response for the player
      bot.replyAndUpdate(msg, initial_response, (err, src, update) => {

        // lookup the player stats and update the message with their formatted
        // stats
        nbaRequest.getPlayerStats(player)
        .then(stats => {
          try {
            const updated_response = formatter.formatStats(
                stats.overallPlayerDashboard[0], player.fullName);

            update(updated_response);
          } catch (err) {
            console.log(err);
            const error_response =
               "Unable to find 2017 - 18 stats for " + player.fullName +
               " :frowning:";
            update(error_response);
          }
        });
      });  // reply and update
    }  // players for loop
  });  // stats listener
};

module.exports = { Austin: Austin };

/* init logger?
  resources.logger = new Winston.Logger( {
    transports: [
      new (Winston.transports.File) ( {
        name: 'austin-logging',
        dirname: configuration.loggingDir,
        filename: configuration.name + '.log',
        level: 'info',
        maxFiles: 3,
        json: false,
        prettyPrint: true,
        humanReadableUnhandledException: true,
        timestamp: function() {
          let date = new Date();

          let h = new String(date.getHours());
          let m = new String(date.getMinutes());

          let hour = h.length === 1 ? '0' + h : h;
          let minute = m.length === 1 ? '0' + m : m;

          return hour + ":" + minute;
        }
      } )
    ]
  });
  resources.logger.info("starting up an instance of austin");
*/
