module.exports = Object.freeze({
  urlRegular: /(http|https):\/\/(\w+:{0,1}\w*#)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&amp;%#!\-/]))?/,
});
const { SECRET_SIGNING_KEY = 'dev-secret' } = process.env;
module.exports = {
  SECRET_SIGNING_KEY,
};
