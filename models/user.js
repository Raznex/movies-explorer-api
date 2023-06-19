const isEmail = require('validator/lib/isEmail');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const WrongEOP = require('../utils/errors/wrongEmailorPass');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      validate: [isEmail, 'Поле "email" неверно заполнено'],
      index: { unique: true },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
  },
  {
    versionKey: false,
    toJSON: {
      useProjection: true,
    },
    toObject: {
      useProjection: true,
    },
  },
  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (user) {
              return bcrypt.compare(password, user.password).then((matched) => {
                if (matched) {
                  return user;
                }
                throw new WrongEOP('Неправильные почта или пароль');
              });
            }
            throw new WrongEOP('Неправильные почта или пароль');
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
