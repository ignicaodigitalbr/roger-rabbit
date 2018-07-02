const { defaultsDeep } = require('lodash');
const channelModule = require('./modules/channel');
const connection = require('./modules/connection');

module.exports = baseOptions => (consumerOptions) => {
  const options = defaultsDeep({}, baseOptions, consumerOptions, { context: 'consumer' });
  const { exchange, queue } = options;

  const consume = channel => channel.assertExchange(exchange.name, exchange.type, exchange.options)
    .then(() => channel.assertQueue(queue.name, queue.options))
    .then(() => channel.bindQueue(queue.name, exchange.name, queue.name))
    .then(() => channelModule.channelConsumer(options, channel));

  return connection.connect(options, consume);
};
