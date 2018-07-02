const consumer = require('./src/consumer');
const publisher = require('./src/publisher');

module.exports = options => ({
  consume: consumer(options),
  publish: publisher(options),
});
