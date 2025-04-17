const express = require('express');
const router = express.Router();
const filmController = require('../controllers/filmController');

router.get('/', filmController.getAllFilms);
router.get('/:id', filmController.getFilmById);

module.exports = router;