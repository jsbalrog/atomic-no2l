'use strict';

module.exports.sendJSONResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.done = function(things, i) {
  return i === things.length-1;
};
