require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Health-Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// KI-Route einbinden
const aiRoute = require('./routes/ai');
app.use('/api/ai', aiRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend läuft auf Port ${PORT}`));