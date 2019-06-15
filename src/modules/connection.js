const amqp = require('amqplib');
const helpers = require('./helpers');

const Module = {};
const channels = {};

Module.connect = (options) => {
  const { host, context } = options;

  if (channels[host] && channels[host][context]) {
    return new Promise(resolve => resolve(channels[host][context]));
  }

  return amqp.connect(host)
    .then(connection => connection.createConfirmChannel())
    .then((channel) => {
      channels[host] = channel[host] ? channels[host] : {};
      channels[host][context] = channel;

      return channels[host][context];
    })
    .catch((error) => {
      helpers.log('error', error.message, options);

      return error;
    });
};

module.exports = Module;
