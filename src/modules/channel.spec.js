const { consume } = require('./channel');
const helpers = require('./helpers');

describe('modules/channel', () => {
  let receivedMessage;
  let channel;
  let options;

  describe('consume', () => {
    beforeEach(() => {
      options = {
        queue: {
          name: 'queue.name',
        },
      };

      channel = {
        consume: jest.fn(),
        reject: jest.fn(),
        ack: jest.fn(),
      };
    });

    test('call channel.consume with queue name', () => {
      consume(options, channel);

      expect(channel.consume).toHaveBeenCalledWith('queue.name', expect.any(Function));
    });

    describe('when the message can be parsed', () => {
      let consumerCallback;

      beforeEach(() => {
        receivedMessage = {
          content: Buffer.from(JSON.stringify({ message: 'message' })),
        };

        channel.consume = (queueName, callback) => callback(receivedMessage);

        jest.spyOn(helpers, 'log').mockImplementation(() => {});
      });

      describe('and the callback is performed', () => {
        beforeEach(() => {
          consumerCallback = jest.fn();

          consume(options, channel, consumerCallback);
        });

        test('log that the message was consumed', () => {
          expect(helpers.log).toHaveBeenCalledWith('info', 'message was consumed', {
            queue: {
              name: 'queue.name',
            },
            message: {
              message: 'message',
            },
          });
        });

        test('return the parsed message', () => {
          expect(consumerCallback).toHaveBeenCalledWith({ message: 'message' });
        });

        test('call channel.ack with received message when ack is called', () => {
          expect(channel.ack).toHaveBeenCalledWith(receivedMessage);
        });
      });

      describe('and the callback is not performed', () => {
        beforeEach(() => {
          consumerCallback = jest.fn().mockImplementation(() => Promise.reject(new Error('message error')));

          consume(options, channel, consumerCallback);
        });

        test('log that the message was not consumed', () => {
          expect(helpers.log).toHaveBeenCalledWith('error', 'message error', options);
        });

        test('call channel.reject with received message', () => {
          expect(channel.reject).toHaveBeenCalledWith(receivedMessage);
        });
      });
    });

    describe('when the message can not be parsed', () => {
      beforeEach(() => {
        channel.consume = (queueName, callback) => callback(receivedMessage);

        jest.spyOn(helpers, 'log').mockImplementation(() => {});

        consume(options, channel, () => { throw Error('message error'); });
      });

      test('log that the message was not consumed', () => {
        expect(helpers.log).toHaveBeenCalledWith('error', 'message error', options);
      });

      test('call channel.reject with received message', () => {
        expect(channel.reject).toHaveBeenCalledWith(receivedMessage);
      });
    });
  });
});
