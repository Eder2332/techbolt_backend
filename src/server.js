require('dotenv').config();
const dns = require('dns');
const app = require('./app');
const { connectDatabase } = require('./config/database');
const { syncUserModel } = require('./models/userModel');

const PORT = process.env.PORT || 3000;

if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder(process.env.DNS_RESULT_ORDER || 'ipv4first');
}

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
