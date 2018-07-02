const helpers = require('./helpers');

const Module = {};

Module.sendToQueue = (options, channel) => new Promise((resolve, reject) => {
  const { queue, message } = options;

  return channel.sendToQueue(queue.name, helpers.jsonToBuffer(message), {}, (error) => {
    if (error) {
      helpers.log('error', error.message, options);

      return reject(error);
    }

    helpers.log('info', 'message is published', options);

    channel.connection.close();

    return resolve({ queue: queue.name, message });
  });
});

module.exports = Module;
