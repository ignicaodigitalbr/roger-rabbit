const { channelConsumer } = require('./channel');
const helpers = require('./helpers');

describe('modules/channel', () => {
  let receivedMessage;
  let channel;
  let options;

  describe('channelConsumer', () => {
    let message;
    let reject;
    let ack;

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
      channelConsumer(options, channel);

      expect(channel.consume).toHaveBeenCalledWith('queue.name', expect.any(Function));
    });

    describe('when the message can be parsed', () => {
      beforeEach((done) => {
        receivedMessage = {
          content: Buffer.from(JSON.stringify({ message: 'message' })),
        };

        channel.consume = (queueName, callback) => callback(receivedMessage);

        jest.spyOn(helpers, 'log').mockImplementation(() => {});

        channelConsumer(options, channel).then((data) => {
          ({ message, ack, reject } = data);

          done();
        });
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
        expect(message).toEqual({ message: 'message' });
      });

      test('call channel.ack with received message when ack is called', () => {
        ack();

        expect(channel.ack).toHaveBeenCalledWith(receivedMessage);
      });

      test('call channel.reject with received message when reject is called', () => {
        reject();

        expect(channel.reject).toHaveBeenCalledWith(receivedMessage);
      });
    });

    describe('when the message can not be parsed', () => {
      let errorMessage;

      beforeEach((done) => {
        receivedMessage = {};

        channel.consume = (queueName, callback) => callback(receivedMessage);

        jest.spyOn(helpers, 'log').mockImplementation(() => {});

        channelConsumer(options, channel).catch((error) => {
          errorMessage = error.message;

          done();
        });
      });

      test('log that the message was not consumed', () => {
        expect(helpers.log).toHaveBeenCalledWith('error', errorMessage, options);
      });

      test('call channel.reject with received message', () => {
        expect(channel.reject).toHaveBeenCalledWith(receivedMessage);
      });
    });
  });
});
