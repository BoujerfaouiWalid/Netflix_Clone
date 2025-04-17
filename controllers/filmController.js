const db = require('../config/db');

exports.getAllFilms = (req, res) => {
  db.query('SELECT * FROM films', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getFilmById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM films WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: 'Film non trouvé.' });
    res.json(results[0]);
  });
};