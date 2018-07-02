const amqp = require('amqplib');
const helpers = require('./helpers');

const Module = {};

Module.connect = (options, onCreateChannel) => amqp.connect(options.host)
  .then(connection => connection.createConfirmChannel())
  .then(channel => onCreateChannel(channel))
  .catch((error) => {
    helpers.log('error', error.message, options);

    return error;
  });

module.exports = Module;
