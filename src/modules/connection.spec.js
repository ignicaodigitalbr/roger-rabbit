const amqp = require('amqplib');
const { connect } = require('./connection');
const helpers = require('./helpers');

describe('modules/connection', () => {
  let host;

  beforeEach(() => {
    host = `host-${Math.floor(Math.random() * (100000))}`;
  });

  describe('connect', () => {
    describe('when connection is created', () => {
      let connection;
      let options;

      beforeEach((done) => {
        connection = {
          createConfirmChannel: () => {},
        };

        options = {
          context: 'context',
          logger: console,
          host,
        };

        jest.spyOn(amqp, 'connect').mockImplementation(() => new Promise(resolve => resolve(connection)));
        jest.spyOn(connection, 'createConfirmChannel').mockImplementation(() => new Promise(resolve => resolve({ channel: true })));

        connect(options).then(() => {
          done();
        });
      });

      test('call amqp.connect with host', () => {
        expect(amqp.connect).toHaveBeenCalledWith(host);
      });

      test('call connection.createConfirmChannel', () => {
        expect(connection.createConfirmChannel).toHaveBeenCalled();
      });
    });

    describe('when connection is created', () => {
      let options;
      let error;

      beforeEach(() => {
        options = {
          logger: console,
          host,
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
