const { defaultsDeep } = require('lodash');
const connection = require('./src/modules/connection');
const consumer = require('./src/consumer');
const publisher = require('./src/publisher');
const sendToQueue = require('./src/sendToQueue');

module.exports = (brokerOptions) => {
  const defaultOptions = { logger: console, disableLog: false };
  const options = defaultsDeep({}, defaultOptions, brokerOptions);

  const connections = {
    consumer: connection.connect({ context: 'consumer', ...options }),
    publisher: connection.connect({ context: 'publisher', ...options }),
  };

  return {
    consume: consumer(connections.consumer, options),
    publish: publisher(connections.publisher, options),
    sendToQueue: sendToQueue(connections.publisher, options),
  };
};
