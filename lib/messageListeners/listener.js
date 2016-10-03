"use strict";

let listener = function(logger) {
  let that = { };
  that.logger = logger;

  that.name = 'genericListener';

  that.handle = function(text) {
    throw new Error('handle func not implimented for ' + that.name); 
  };

  that.composeResponse = function(info) {
    throw new Error('composeResponse func not implimented for ' + that.name); 
  };

  return that;
}

module.exports = { listener };
