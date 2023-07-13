module.exports = class WrongEmailOrPass extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
};
