const publisher = require('./publisher');
const helpers = require('./modules/helpers');

describe('publisher', () => {
  let publisherOptions;
  let baseOptions;
  let message;
  let channel;
  let connection;

  beforeEach(() => {
    baseOptions = {
      host: 'host',
      disableLog: true,
      exchange: {
        name: 'exchange.name',
      },
    };

    publisherOptions = {};

    message = { message: true };

    channel = {
      connection: {
        close: jest.fn(),
      },
    };

    connection = new Promise(resolve => resolve(channel));
  });

  describe('when the message was published', () => {
    beforeEach((done) => {
      channel.publish = jest.fn().mockReturnValue(true);

      jest.spyOn(helpers, 'log');

      publisher(connection, baseOptions)('routing.key', message, publisherOptions)
        .then(() => done());
    });

    test('call channel.publish with correct params', () => {
      expect(channel.publish).toHaveBeenCalledWith(
        'exchange.name',
        'routing.key',
        helpers.jsonToBuffer(message),
        publisherOptions,
      );
    });

    test('call log info', () => {
      expect(helpers.log).toHaveBeenCalledWith('info', 'message is published', expect.any(Object));
    });
  });

  describe('when the message was not published', () => {
    beforeEach((done) => {
      channel.publish = jest.fn().mockReturnValue(false);

      jest.spyOn(helpers, 'log');

      publisher(connection, baseOptions)('routing.key', message, publisherOptions)
        .catch(() => done());
    });

    test('call channel.publish with correct params', () => {
      expect(channel.publish).toHaveBeenCalledWith(
        'exchange.name',
        'routing.key',
        helpers.jsonToBuffer(message),
        publisherOptions,
      );
    });

    test('call log error', () => {
      expect(helpers.log).toHaveBeenCalledWith('error', 'Message can not be published', expect.any(Object));
    });
  });
});
