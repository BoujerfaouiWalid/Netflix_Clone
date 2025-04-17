// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Inscription
exports.register = (req, res) => {
  const { name, email, password } = req.body;

  // Vérification des champs
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  // Vérifier si l'utilisateur existe déjà
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur
    const sql = 'INSERT INTO users (name, email, password, date_inscription) VALUES (?, ?, ?, NOW())';
    db.query(sql, [name, email, hashedPassword], (err) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: 'Utilisateur enregistré avec succès !' });
    });
  });
};

// Connexion
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Créer le token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Connexion réussie !',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        date_inscription: user.date_inscription
      }
    });
  });
};

// Obtenir les infos du profil (si connecté)
exports.getProfile = (req, res) => {
  const userId = req.user.id;
  db.query('SELECT id, name, email, date_inscription FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
};
