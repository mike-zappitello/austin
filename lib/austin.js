var Slack = require('slack-client');

var Austin = function(configuration) {
    slack = new Slack(
            configuration.slackToken, configuration.autoReconnect,
            configuration.autoMark);

    slack.on('open', function(data) {
      console.log("open\n" + data);
    });

    slack.on('message', function(message) {
      console.log("received\n" + message);
    });

    slack.on('error', function(error) {
      console.log("error\n" + error);
    });

    slack.login();
}

module.exports = {
  Austin: Austin
}
