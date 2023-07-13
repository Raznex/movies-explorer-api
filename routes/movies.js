const router = require('express').Router();
const { celebrate } = require('celebrate');

const { JoiParamsMovieID, JoiBodyMovieParams } = require('../utils/joyValidation');
const {
  getMovies, addMovie, deleteMovieById,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', celebrate(JoiBodyMovieParams), addMovie);
router.delete('/:movieId', celebrate(JoiParamsMovieID), deleteMovieById);

module.exports = router;
