[![Travis](https://img.shields.io/travis/ignicaodigitalbr/roger-rabbit.svg?style=flat-square)](https://travis-ci.org/ignicaodigitalbr/roger-rabbit/builds)
[![Codecov](https://img.shields.io/codecov/c/github/ignicaodigitalbr/roger-rabbit.svg?style=flat-square)](https://codecov.io/gh/ignicaodigitalbr/roger-rabbit/)
[![npm](https://img.shields.io/npm/v/roger-rabbit.svg?style=flat-square)](https://www.npmjs.com/package/roger-rabbit)
[![npm](https://img.shields.io/npm/dt/roger-rabbit.svg?style=flat-square)](https://www.npmjs.com/package/roger-rabbit)

# Roger Rabbit

Roger Rabbit is a module that makes the process of consuming and publishing messages in message brokers easier. It is a wrapper for [amqplib](https://www.squaremobius.net/amqp.node/).

## Install

```shell
npm install roger-rabbit --save
```

## Example

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
```

```javascript
// consumer.js
const broker = require('./broker');

const queue = {
  name: 'queue.name',
};

broker.consume({ queue }).then({ message, ack, reject } => {
  // do something with message
  ack();
});
```

```javascript
// publisher.js
const broker = require('./broker');

broker.publish('queue.name', { message: 'hello world' });
```

## Documentation

### Broker

| Option     | Description                           | Required  | Default |
| -----------|---------------------------------------|-----------|---------|
| host       | message broker connection url         | yes       | null    |
| logger     | logger object                         | no        | console |
| disableLog | disable log (all levels)              | no        | false   |
| exchange   | [exchange options](#exchange-options) | no        | null    |
| queue      | [queue options](#queue-options)       | no        | null    |


### Exchange options

| Option  | Description                                                                                                     | Default                 |
| --------|-----------------------------------------------------------------------------------------------------------------|-------------------------|
| type    | direct, topic, fanout                                                                                           | empty string (deafault) |
| name    | exchange name                                                                                                   | null                    |
| options | options used in [assertExchange](http://www.squaremobius.net/amqp.node/channel_api.html#channel_assertExchange) | null                    |

### Queue options

| Option  | Description                                                                                               | Default |
| --------|-----------------------------------------------------------------------------------------------------------|---------|
| name    | queue name                                                                                                | null    |
| options | options used in [assertQueue](http://www.squaremobius.net/amqp.node/channel_api.html#channel_assertQueue) | null    |

### broker.consume

`broker.consume` expects to receive [broker options](#broker). Example:

```javascript
const queue = {
  name: 'queue.name',
  options: {},
};

broker.consume({ queue })
  .then(({ ack, reject, message }) => /* handle success */)
  .catch(error => /* handle error */);
```

### broker.publish

`broker.publish` expects to receive queue name, message and [broker options](#broker). Example:

```javascript
const queue = {
  options: {},
};

broker.publish('queue.name', { message: 'message' }, { queue })
  .then(({ queue, message }) => /* handle success */)
  .catch(error => /* handle error */);
```
