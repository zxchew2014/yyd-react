import express from 'express';
import path from 'path';
const app = express();

app.post('/api/auth', (req, res) => {
  res.status(400).json({ errors: { global: 'Invalid credentials' } });
});

app.post('/api/users', (req, res) => {
  res.status(400).json({ errors: { global: 'ERROR' } });
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8080, () => console.log('Runninng on 8080'));
