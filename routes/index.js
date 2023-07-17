const router = require('express').Router();
const { celebrate } = require('celebrate');
const cors = require('cors');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errors/notFound');
const { login, register } = require('../controllers/users');
const { JoiBodyEmailPassword, JoiBodyEmailPasswordName } = require('../utils/joyValidation');

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://mesto.raznex.nomoredomains.rocks',
  'https://mesto.raznex.nomoredomains.rocks',
  'http://192.168.0.197:3000',
];

router.use(cors({
  origin: allowedCors,
  credentials: true,
})); // подключаем CORS

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', celebrate(JoiBodyEmailPassword), login);
router.post('/signup', celebrate(JoiBodyEmailPasswordName), register);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => next(new NotFoundError('Страницы по запрошенному URL не существует')));

module.exports = router;
