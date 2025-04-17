const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const filmRoutes = require('./routes/filmRoutes');
const rentalRoutes = require('./routes/rentalRoutes');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/api/films', filmRoutes);
app.use('/api/rentals', rentalRoutes);



app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenue sur notre API de location de films !');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
