require('dotenv').config();
const app = require('./app');
const { connectDatabase } = require('./config/database');
const { syncUserModel } = require('./models/userModel');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();
    await syncUserModel();

    app.listen(PORT, () => {
      console.log(`Servidor Tecbolt corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
}

startServer();
