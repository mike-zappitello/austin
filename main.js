Slack = require('slack-client');

slackToken = 'xoxb-19918014225-2YhCXhSDmq2mB75tnSfxlCRP';
autoReconnect = true;
autoMark = true;

slack = new Slack(slackToken, autoReconnect, autoMark);

slack.on('open', function(data) {
  console.log("open\n" + data);
});

slack.on('message', function(message) {
  console.log("message\n" + message);
});

slack.on('error', function(error) {
  console.log("error\n" + error);
});

slack.login();
