const { defaultsDeep } = require('lodash');
const consumer = require('./consumer');
const channelModule = require('./modules/channel');
const connection = require('./modules/connection');

describe('consumer', () => {
  let consumerOptions;
  let baseOptions;
  let channel;

  beforeEach(() => {
    const promiseMock = jest.fn();

    promiseMock.mockReturnValue(new Promise(resolve => resolve()));

    channel = {
      assertExchange: promiseMock,
      assertQueue: promiseMock,
      bindQueue: promiseMock,
    };

    consumerOptions = {
      queue: {
        name: 'queue.name',
        options: {},
      },
    };

    baseOptions = {
      host: 'host',
      exchange: {
        name: 'exchange.name',
        type: 'topic',
        options: {},
      },
    };

    jest.spyOn(connection, 'connect').mockImplementation((options, callback) => callback(channel));
    jest.spyOn(channelModule, 'channelConsumer').mockImplementation(() => {});

    consumer(baseOptions)(consumerOptions);
  });

  test('call connection.connect', () => {
    expect(connection.connect).toHaveBeenCalledWith(defaultsDeep({}, baseOptions, consumerOptions, { context: 'consumer' }), expect.any(Function));
  });

  test('call channel.assertExchange', () => {
    expect(channel.assertExchange).toHaveBeenCalledWith('exchange.name', 'topic', {});
  });

  test('call channel.assertQueue', () => {
    expect(channel.assertQueue).toHaveBeenCalledWith('queue.name', {});
  });

  test('call channel.assertQueue', () => {
    expect(channel.bindQueue).toHaveBeenCalledWith('queue.name', 'exchange.name', 'queue.name');
  });

  test('call channelConsumer', () => {
    expect(channelModule.channelConsumer).toHaveBeenCalledWith(defaultsDeep({}, baseOptions, consumerOptions, { context: 'consumer' }), expect.any(Object));
  });
});
