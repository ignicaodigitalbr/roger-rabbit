const { defaultsDeep } = require('lodash');
const channelModule = require('./modules/channel');

module.exports = (connection, baseOptions) => (consumerOptions, callback) => {
  const options = defaultsDeep({}, baseOptions, consumerOptions, { context: 'consumer' });
  const {
    exchange,
    queue,
    routingKey,
    prefetch,
  } = options;

  const consume = channel => channel.assertExchange(exchange.name, exchange.type, exchange.options)
    .then(() => channel.assertQueue(queue.name, queue.options))
    .then(() => channel.bindQueue(queue.name, exchange.name, routingKey))
    .then(() => channel.prefetch(parseInt(prefetch, 10) || 1))
    .then(() => channelModule.consume(options, channel, callback));

  return connection.then(consume);
};
