const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();
const NotFoundError = require('../utils/errors/notFound');
const BadRequestError = require('../utils/errors/badReq');
const ConflictError = require('../utils/errors/conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь c указанным _id не найден');
      }
      res.status(200).send({ user });
    })
    .catch(next);
};

const isEmailRegistered = async (email) => {
  try {
    const user = await User.findOne({ email });
    return !!user; // Вернуть true, если email найден, и false в противном случае
  } catch (err) {
    throw err;
  }
};

module.exports.updateUserInfo = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    // Проверяем, не зарегистрирован ли данный email
    const emailRegistered = await isEmailRegistered(email);
    if (emailRegistered) {
      throw new BadRequestError('Такой email уже зарегистрирован');
    }

    // Если email не зарегистрирован, обновляем информацию пользователя
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    }

    res.send({ user });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      const message = Object.values(err.errors).map((error) => error.message).join('; ');
      next(new BadRequestError(message));
    } else {
      next(err);
    }
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.status(200).cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
      }).send({ email, token });
    })
    .catch(next);
};

module.exports.register = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        const message = Object.values(err.errors).map((error) => error.message).join('; ');
        next(new BadRequestError(message));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким электронным адресом уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};
