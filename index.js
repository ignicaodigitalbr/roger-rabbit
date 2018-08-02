const { defaultsDeep } = require('lodash');
const consumer = require('./src/consumer');
const publisher = require('./src/publisher');

module.exports = (brokerOptions) => {
  const defaultOptions = { logger: console, disableLog: false };
  const options = defaultsDeep({}, defaultOptions, brokerOptions);

  return {
    consume: consumer(options),
    publish: publisher(options),
  };
};
