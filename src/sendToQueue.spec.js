const queueModule = require('./modules/queue');
const sendToQueue = require('./sendToQueue');

describe('sendToQueue', () => {
  describe('call sendToQueue', () => {
    let sendToQueueOptions;
    let baseOptions;
    let message;
    let channel;
    let connection;

    beforeEach(() => {
      baseOptions = { host: 'host' };

      sendToQueueOptions = { queue: { foo: true } };

      message = { message: true };

      channel = {
        connection: {
          close: jest.fn(),
        },
      };

      connection = new Promise(resolve => resolve(channel));

      jest.spyOn(queueModule, 'sendToQueue').mockImplementation(() => new Promise(resolve => resolve()));

      sendToQueue(connection, baseOptions)('queue.name', message, sendToQueueOptions);
    });

    test('call sendToQueue', () => {
      expect(queueModule.sendToQueue).toHaveBeenCalled();
    });
  });
});
