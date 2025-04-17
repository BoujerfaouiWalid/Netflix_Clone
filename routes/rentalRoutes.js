const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/rent', verifyToken, rentalController.rentFilm);
router.post('/return', verifyToken, rentalController.returnFilm);
router.get('/my-rentals', verifyToken, rentalController.getMyRentals);

module.exports = router;