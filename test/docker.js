var dockerOpts = require('dockerode-options'),
    Docker = require('dockerode');

module.exports = function docker(options) {
  return new Docker(dockerOpts());
};
