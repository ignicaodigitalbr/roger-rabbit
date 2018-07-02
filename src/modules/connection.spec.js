const amqp = require('amqplib');
const { connect } = require('./connection');
const helpers = require('./helpers');

describe('modules/connection', () => {
  describe('connect', () => {
    describe('when connection is created', () => {
      let onCreateChannel;
      let connection;
      let options;

      beforeEach(() => {
        onCreateChannel = jest.fn();

        connection = {
          createConfirmChannel: () => {},
        };

        options = {
          host: 'host',
          logger: console,
        };

        jest.spyOn(amqp, 'connect').mockImplementation(() => new Promise(resolve => resolve(connection)));
        jest.spyOn(connection, 'createConfirmChannel').mockImplementation(() => new Promise(resolve => resolve({ channel: true })));

        connect(options, onCreateChannel);
      });

      test('call amqp.connect with host', () => {
        expect(amqp.connect).toHaveBeenCalledWith('host');
      });

      test('call connection.createConfirmChannel', () => {
        expect(connection.createConfirmChannel).toHaveBeenCalled();
      });

      test('call onCreateChannel with channel created', () => {
        expect(onCreateChannel).toHaveBeenCalledWith({ channel: true });
      });
    });

    describe('when connection is created', () => {
      let options;
      let error;

      beforeEach(() => {
        options = {
          host: 'host',
          logger: console,
        };

        error = new Error('error message');

        jest.spyOn(amqp, 'connect').mockImplementation(() => new Promise((resolve, reject) => reject(error)));
        jest.spyOn(helpers, 'log').mockImplementation(() => {});

        connect(options);
      });

      test('when an error occurs', () => {
        expect(helpers.log).toHaveBeenCalledWith('error', 'error message', options);
      });
    });
  });
});
