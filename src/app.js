require('dotenv').config();
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const viewRoutes = require('./routes/viewRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', viewRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>No encontrado</title>
      </head>
      <body>
        <h1>404</h1>
        <p>La ruta solicitada no existe.</p>
        <a href="/">Volver al inicio</a>
      </body>
    </html>
  `);
});

module.exports = app;
