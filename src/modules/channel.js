const helpers = require('./helpers');

const Module = {};

Module.channelConsumer = (options, channel) => new Promise((resolve, rejectPromise) => {
  const { queue } = options;

  return channel.consume(queue.name, (receivedMessage) => {
    const reject = () => channel.reject(receivedMessage);
    const ack = () => channel.ack(receivedMessage);

    let message;

    try {
      message = helpers.bufferToJson(receivedMessage.content);
    } catch (error) {
      helpers.log('error', error.message, options);

      reject();

      return rejectPromise(error);
    }

    helpers.log('info', 'message was consumed', Object.assign({}, options, { message }));

    return resolve({ message, ack, reject });
  });
});

module.exports = Module;
