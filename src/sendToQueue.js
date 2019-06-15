const { defaultsDeep } = require('lodash');
const queueModule = require('./modules/queue');

module.exports = (connection, baseOptions) => (queueName, message, sendToQueueOptions) => {
  const queue = { name: queueName };
  const context = 'sendToQueue';
  const options = defaultsDeep({}, baseOptions, { context, message, queue }, sendToQueueOptions);

  return connection
    .then(channel => queueModule.sendToQueue(options, channel));
};
