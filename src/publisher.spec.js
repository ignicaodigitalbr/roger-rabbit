const { defaultsDeep } = require('lodash');
const connection = require('./modules/connection');
const queueModule = require('./modules/queue');
const publisher = require('./publisher');

describe('publisher', () => {
  describe('call sendToQueue', () => {
    let publisherOptions;
    let baseOptions;
    let context;
    let message;
    let channel;

    beforeEach(() => {
      baseOptions = { host: 'host' };
      publisherOptions = { queue: { foo: true } };
      context = 'publisher';
      message = { message: true };
      channel = {
        connection: {
          close: jest.fn(),
        },
      };

      jest.spyOn(connection, 'connect').mockImplementation((options, callback) => callback(channel));
      jest.spyOn(queueModule, 'sendToQueue').mockImplementation(() => new Promise(resolve => resolve()));

      publisher(baseOptions)('queue.name', message, publisherOptions);
    });

    test('call connection.connect', () => {
      expect(connection.connect).toHaveBeenCalledWith(defaultsDeep({}, baseOptions, { context, message, queue: { name: 'queue.name' } }, publisherOptions), expect.any(Function));
    });

    test('call sendToQueue', () => {
      expect(queueModule.sendToQueue).toHaveBeenCalled();
    });
  });
});
