const Module = {};

Module.jsonToBuffer = message => Buffer.from(JSON.stringify(message));

Module.bufferToJson = buffer => JSON.parse(buffer.toString());

Module.log = (level, logMessage, options) => {
  const { queue, context, message } = options;
  const metadata = { queue, context, message };

  if (!options.disableLog) {
    options.logger[level](logMessage, { metadata });
  }
};

module.exports = Module;
