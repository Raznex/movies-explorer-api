const jwt = require('jsonwebtoken');
require('dotenv').config();
const UnauthorizedError = require('../utils/errors/unAutorize');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new UnauthorizedError('Отсутствует jwt токен'));
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new UnauthorizedError('Необходимо авторизироваться'));
  }

  req.user = payload;

  return next();
};
