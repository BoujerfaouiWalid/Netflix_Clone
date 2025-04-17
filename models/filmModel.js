const db = require('../config/db');

module.exports = {
  getAll: (callback) => {
    db.query('SELECT * FROM films', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM films WHERE id = ?', [id], callback);
  },

  updateCopies: (id, change, callback) => {
    const sql = 'UPDATE films SET available_copies = available_copies + ? WHERE id = ?';
    db.query(sql, [change, id], callback);
  }
};