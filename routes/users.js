const router = require('express').Router();
const { celebrate } = require('celebrate');

const { JoiBodyNameEmail } = require('../utils/joyValidation');
const { getUser, updateUserInfo } = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', celebrate(JoiBodyNameEmail), updateUserInfo);

module.exports = router;
