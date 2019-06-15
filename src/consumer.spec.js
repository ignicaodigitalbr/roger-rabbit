const { defaultsDeep } = require('lodash');
const consumer = require('./consumer');
const channelModule = require('./modules/channel');

describe('consumer', () => {
  let consumerOptions;
  let baseOptions;
  let channel;
  let connection;
  let callback;

  beforeEach((done) => {
    const assertExchange = jest.fn();
    const assertQueue = jest.fn();
    const bindQueue = jest.fn();

    assertExchange.mockReturnValue(new Promise(resolve => resolve()));
    assertQueue.mockReturnValue(new Promise(resolve => resolve()));
    bindQueue.mockReturnValue(new Promise(resolve => resolve()));

    channel = {
      assertExchange,
      assertQueue,
      bindQueue,
      prefetch: jest.fn(),
    };

    consumerOptions = {
      queue: {
        name: 'queue.name',
        options: {},
      },
      routingKey: 'routing.key',
    };

    baseOptions = {
      host: 'host',
      exchange: {
        name: 'exchange.name',
        type: 'topic',
        options: {},
      },
    };

    connection = new Promise(resolve => resolve(channel));

    callback = jest.fn();

    jest.spyOn(channelModule, 'consume').mockImplementation(() => {});

    consumer(connection, baseOptions)(consumerOptions, callback).then(() => done());
  });

  test('call channel.assertExchange', () => {
    expect(channel.assertExchange).toHaveBeenCalledWith('exchange.name', 'topic', {});
  });

  test('call channel.assertQueue', () => {
    expect(channel.assertQueue).toHaveBeenCalledWith('queue.name', {});
  });

  test('call channel.bindQueue', () => {
    expect(channel.bindQueue).toHaveBeenCalledWith('queue.name', 'exchange.name', 'routing.key');
  });

  test('call consume', () => {
    expect(channelModule.consume).toHaveBeenCalledWith(defaultsDeep({}, baseOptions, consumerOptions, { context: 'consumer' }), expect.any(Object), callback);
  });
});
