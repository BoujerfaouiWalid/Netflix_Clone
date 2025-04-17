const db = require('../config/db');

exports.rentFilm = (req, res) => {
  const userId = req.user.id;
  const { film_id } = req.body;

  const checkQuery = `
    SELECT * FROM rentals WHERE user_id = ? AND film_id = ? AND return_date IS NULL
  `;
  const countQuery = `
    SELECT COUNT(*) AS count FROM rentals WHERE user_id = ? AND return_date IS NULL
  `;
  const filmQuery = `SELECT * FROM films WHERE id = ?`;

  db.query(checkQuery, [userId, film_id], (err, existing) => {
    if (err) return res.status(500).json(err);
    if (existing.length > 0) return res.status(400).json({ message: 'Film déjà loué.' });

    db.query(countQuery, [userId], (err, countRes) => {
      if (err) return res.status(500).json(err);
      if (countRes[0].count >= 5) return res.status(400).json({ message: 'Limite de 5 films atteinte.' });

      db.query(filmQuery, [film_id], (err, filmRes) => {
        if (err) return res.status(500).json(err);
        if (filmRes.length === 0) return res.status(404).json({ message: 'Film introuvable.' });

        const film = filmRes[0];
        if (film.available_copies <= 0) return res.status(400).json({ message: 'Plus de copies disponibles.' });

        db.query('INSERT INTO rentals (user_id, film_id, rental_date) VALUES (?, ?, NOW())', [userId, film_id], (err) => {
          if (err) return res.status(500).json(err);
          db.query('UPDATE films SET available_copies = available_copies - 1 WHERE id = ?', [film_id]);
          res.json({ message: 'Film loué avec succès !' });
        });
      });
    });
  });
};

exports.returnFilm = (req, res) => {
  const userId = req.user.id;
  const { rental_id } = req.body;

  db.query('SELECT * FROM rentals WHERE id = ? AND user_id = ? AND return_date IS NULL', [rental_id, userId], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: 'Location non trouvée ou déjà retournée.' });

    const film_id = results[0].film_id;

    db.query('UPDATE rentals SET return_date = NOW() WHERE id = ?', [rental_id], (err) => {
      if (err) return res.status(500).json(err);
      db.query('UPDATE films SET available_copies = available_copies + 1 WHERE id = ?', [film_id]);
      res.json({ message: 'Film retourné avec succès.' });
    });
  });
};

exports.getMyRentals = (req, res) => {
  const userId = req.user.id;
  db.query('SELECT r.*, f.title FROM rentals r JOIN films f ON r.film_id = f.id WHERE r.user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
