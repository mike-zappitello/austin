/// Contains the logic for parsing messages and looking for events slackbot
/// reponds to.
///
/// Exports:
///   * parse - function that parses messages and responds

"use strict";

/// object that will parse messages and look through a list of answers
///
/// @webClient - a representation of the current slack session
/// @context - the nba context for what austin know about
let MessageParser = function(webClient, context, logger) {
  this.webClient = webClient;
  this.context = context;
  this.logger = logger;

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
        listener.composeResponse(info, function(newMessage) {
          self.webClient.chat.postMessage(
            channel, newMessage, { as_user: true }
          );
        });
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
  playerStatsParser: require('./messageListeners/playerStatsListener').listener
};
