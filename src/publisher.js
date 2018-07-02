const { defaultsDeep } = require('lodash');
const queueModule = require('./modules/queue');
const connection = require('./modules/connection');

module.exports = baseOptions => (queueName, message, publisherOptions) => {
  const queue = { name: queueName };
  const context = 'publisher';
  const options = defaultsDeep({}, baseOptions, { context, message, queue }, publisherOptions);

  const publish = channel => queueModule.sendToQueue(options, channel)
    .catch((error) => {
      channel.connection.close();

      return error;
    });

  return connection.connect(options, publish);
};
