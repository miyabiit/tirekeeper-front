var config = require('config');

exports.get = function(InStr){
  return config.messages[InStr];
};
