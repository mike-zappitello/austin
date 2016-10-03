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
    // get the channel and make sure that we're a member of the chanel
    let channel = message.channel;

    // FIXME - this method no longer exists. it can save time if we do this
    // if (!channel.is_member) {
    //   return;
    // }

    this.logger.info('parsing message: ' + message.text);

    // for each listener, try to match the the message, and respond if succesful
    for (let id in this.listeners) {
      // get the listener
      let listener = this.listeners[id]

      // try to match the pattern for the listener. if there is a match, use the
      // listeners createResponse method, and send that response to the channel.
      let matched = listener.pattern.exec(message.text);
      if (matched) {
        listener.response(this.webClient, channel,  matched, this.context);
      }
    }
  },

  addListener: function(listener) {
    // TODO - add some basic tests to make sure this listener works correctly
    this.listeners[listener.name] = listener;
  }
};

module.exports = {
  MessageParser: MessageParser,
  playerStatsParser: require('./messageListeners/playerStatsListener')
};
