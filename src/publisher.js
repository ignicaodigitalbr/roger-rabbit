const { defaultsDeep } = require('lodash');
const helpers = require('./modules/helpers');

module.exports = (connection, baseOptions) => (routingKey, message, publisherOptions = {}) => {
  const context = 'publisher';
  const content = helpers.jsonToBuffer(message);
  const options = defaultsDeep({}, baseOptions, { context, message }, publisherOptions);
  const { exchange } = options;

  const publish = (channel) => {
    const published = channel.publish(exchange.name, routingKey, content, publisherOptions);

    if (published) {
      helpers.log('info', 'message is published', options);
      return message;
    }

    helpers.log('error', 'Message can not be published', options);

    throw Error('Message can not be published');
  };

  return connection.then(publish);
};
