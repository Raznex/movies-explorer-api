const jwt = require('jsonwebtoken');
require('dotenv').config();
const UnauthorizedError = require('../utils/errors/unAutorize');
const cfg = require('../cfg');

// let { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  const token = authorization.replace(bearer, '');

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnauthorizedError('Отсутствует jwt токен'));
  }

  let payload;

  try {
    payload = jwt.verify(token, cfg.SECRET_SIGNING_KEY);
  } catch (err) {
    return next(new UnauthorizedError('Необходимо авторизироваться'));
  }

  req.user = payload;

  return next();
};
