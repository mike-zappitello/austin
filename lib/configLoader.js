"use strict";

const fs   = require('fs');
const path = require('path');

// helper function for loading a coniguration from a json file
const loadConfig = configPath => {
  const configuration = JSON.parse(fs.readFileSync(configPath));

  configuration.name = configuration.name || "unknown";
  configuration.loggingDir = path.resolve(__dirname, '..', 'logs');

  if (!configuration.slackToken) {
      throw new Error("configuration missing 'slackToken' member");
  }

  return configuration;
};

module.exports = { loadConfig: loadConfig };
