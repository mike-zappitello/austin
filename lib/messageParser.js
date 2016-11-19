"use strict";

/// object that will parse messages and look through a list of answers
///
/// @webClient - a representation of the current slack session
let MessageParser = function(webClient, resources) {
  this.webClient = webClient;
  this.resources = resources;
  this.logger = resources.logger;

  this.logger.info('creating message parser');

  this.listeners = [];
}

MessageParser.prototype = {
  constructor: MessageParser,

  /// look at a message and respond to it if necessary
  ///
  /// @message - { type, channel, user, text, ts, team }
  handleMessage: function(message) {
    let self = this;

    // get the channel and make sure that we're a member of the chanel
    let channel = message.channel;

    this.logger.info('parsing message: ' + message.text);

    // for each listener, try to match the the message, and respond if succesful
    for (let id in self.listeners) {
      // get the listener
      let listener = self.listeners[id]

      // if this listener can handle the message, then create and post a
      // response
      let info = listener.handle(message.text);
      if (info) {
        let sendMessage = function(message) {
          self.webClient.chat.postMessage(channel, message, { as_user: true });
        }
        listener.composeResponse(info, self.resources, sendMessage);
      }
    }
  },

  addListener: function(listener) {
    if (listener.name === 'generic_listener') {
      this.logger.error('attempted to add a generic listener');
    } else {
      this.listeners[listener.name] = listener;
    }
  }
};

module.exports = {
  MessageParser: MessageParser,
  statsListener: require('./messageListeners/playerStatsListener').listener,
  standingsListener: require('./messageListeners/standingsListener').listener
};
