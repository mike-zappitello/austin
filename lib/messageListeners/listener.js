"use strict";

/// default / empty constructor for a message listener. initialize at the
/// begining of creating a new listener. override the handle and composeResponse
/// functions.
let listener = function() {
  let that = { };
  that.name = 'genericListener';

  /// parse out information from a message for replying to.
  /// 
  /// if this message should be ignored, return null or an empty dict
  /// if this message should be replied to, return a dict of all the important
  /// information.
  that.handle = function(text) {
    throw new Error('handle func not implimented for ' + that.name); 
  };

  /// compose a response to the message that was succesfully parsed in handle
  ///
  /// @info is a dict of information that was parsed out of the message
  /// @resources is a dict of resources for getting new data from
  /// @postMessage is a function for posting the message in the right way
  that.composeResponse = function(info, resources, postMessage) {
    throw new Error('composeResponse func not implimented for ' + that.name); 
  };

  return that;
}

module.exports = { listener };
