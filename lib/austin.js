"use strict";

const botkit = require('botkit');
const controller = botkit.slackbot();

const Austin = configuration => {
    const bot = controller.spawn( { token: configuration.slackToken } );

    bot.startRTM(err => { if (err) throw err; });

    controller.hears(/hello/i, ['direct_message'], (bot, msg) => {
      console.log(msg);
      bot.reply(msg, 'I have some thoughts.');
    });
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
