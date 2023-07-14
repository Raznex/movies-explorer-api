const token = require('jsonwebtoken');
require('dotenv').config();
const UnauthorizedError = require('../utils/errors/unAutorize');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    return next(new UnauthorizedError('Отсутствует jwt токен'));
  }

  let payload;

  try {
    payload = token.verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret');
  } catch (err) {
    return next(new UnauthorizedError('Необходимо авторизироваться'));
  }

  req.user = payload;

  return next();
};
