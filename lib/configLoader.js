var fs   = require('fs'),
    path = require('path');

module.exports = {
  loadConfig: function(configPath) {
    var configuration = JSON.parse(fs.readFileSync(configPath));

    configuration.name = configuration.name || "unknown";
    configuration.loggingDir = path.resolve(__dirname, '..', 'logs');

    if (!configuration.slackToken) {
      throw new Error("configuration missing 'slackToken' member");
    }

    return configuration;
  }
};
