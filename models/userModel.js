const db = require('../config/db');

module.exports = {
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  },

  createUser: (user, callback) => {
    const sql = 'INSERT INTO users (name, email, password, date_inscription) VALUES (?, ?, ?, NOW())';
    db.query(sql, [user.name, user.email, user.password], callback);
  },

  findById: (id, callback) => {
    db.query('SELECT id, name, email, date_inscription FROM users WHERE id = ?', [id], callback);
  }
};