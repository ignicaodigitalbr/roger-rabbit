const { jsonToBuffer, bufferToJson, log } = require('./helpers');

describe('modules/helpers', () => {
  describe('jsonToBuffer', () => {
    let result;

    beforeEach(() => {
      result = jsonToBuffer({ message: true });
    });

    test('create a buffer from json', () => {
      expect(result).toEqual(Buffer.from(JSON.stringify({ message: true })));
    });
  });

  describe('bufferToJson', () => {
    let result;

    beforeEach(() => {
      const message = Buffer.from(JSON.stringify({ message: true }));

      result = bufferToJson(message);
    });

    test('parse buffer to json', () => {
      expect(result).toEqual({ message: true });
    });
  });

  describe('log', () => {
    let options;

    beforeEach(() => {
      options = {
        logger: console,
        queue: {},
        context: '',
        message: '',
      };
    });

    describe('when logger is enabled', () => {
      beforeEach(() => {
        options.disableLog = false;

        jest.spyOn(console, 'info').mockImplementation(() => {});

        log('info', 'message', options);
      });

      test('call logger with message and metadata', () => {
        const metadata = { queue: {}, message: '', context: '' };

        expect(console.info).toHaveBeenCalledWith('message', { metadata });
      });
    });

    describe('when logger is disabled', () => {
      beforeEach(() => {
        options.disableLog = true;

        jest.spyOn(console, 'error');

        log('error', 'message', options);
      });

      test('does not call logger', () => {
        expect(console.error).not.toHaveBeenCalled();
      });
    });
  });
});
