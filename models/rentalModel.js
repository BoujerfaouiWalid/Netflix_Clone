const db = require('../config/db');

module.exports = {
  checkActiveRental: (userId, filmId, callback) => {
    const sql = 'SELECT * FROM rentals WHERE user_id = ? AND film_id = ? AND return_date IS NULL';
    db.query(sql, [userId, filmId], callback);
  },

  countActiveRentals: (userId, callback) => {
    const sql = 'SELECT COUNT(*) AS count FROM rentals WHERE user_id = ? AND return_date IS NULL';
    db.query(sql, [userId], callback);
  },

  createRental: (userId, filmId, callback) => {
    const sql = 'INSERT INTO rentals (user_id, film_id, rental_date) VALUES (?, ?, NOW())';
    db.query(sql, [userId, filmId], callback);
  },

  markReturned: (rentalId, callback) => {
    const sql = 'UPDATE rentals SET return_date = NOW() WHERE id = ?';
    db.query(sql, [rentalId], callback);
  },

  getUserRentals: (userId, callback) => {
    const sql = `SELECT r.*, f.title FROM rentals r JOIN films f ON r.film_id = f.id WHERE r.user_id = ?`;
    db.query(sql, [userId], callback);
  },

  getRentalById: (rentalId, userId, callback) => {
    const sql = 'SELECT * FROM rentals WHERE id = ? AND user_id = ? AND return_date IS NULL';
    db.query(sql, [rentalId, userId], callback);
  }
};