[![Travis](https://img.shields.io/travis/ignicaodigitalbr/roger-rabbit.svg?style=flat-square)](https://travis-ci.org/ignicaodigitalbr/roget-rabbit/builds)

# Roger Rabbit

Roger Rabbit is a module that makes the process of consuming and publishing messages in message brokers easier.

## Usage

Roger Rabbit is a wrapper for [amqplib](https://www.squaremobius.net/amqp.node/). For exchange and queue options read [amqplib documentation](https://www.squaremobius.net/amqp.node/channel_api.html).

```javascript
// broker.js
const Broker = require('roger-rabbit');

module.exports = Broker({
  host: 'amqp://guest:guest@localhost:5672',
  exchange: {
    type: 'topic',
    name: 'exchange',
  },
});

// consumer.js
const broker = require('./broker');

const queue = {
  name: 'queue.name',
};

broker.consume({ queue }).then({ message, ack, reject } => {
  // do something with message
  ack();
});

// publisher.js
const broker = require('./broker');

broker.publish('queue.name', { message: 'hello world' });
```
