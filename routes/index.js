const router = require('express').Router();
const { celebrate } = require('celebrate');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errors/notFound');
const { login, register } = require('../controllers/users');

const { JoiBodyEmailPassword, JoiBodyEmailPasswordName } = require('../utils/joyValidation');

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
