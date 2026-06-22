const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl:
      process.env.DB_SSL === 'true'
        ? {
            require: true,
            rejectUnauthorized: false
          }
        : false
  }
});

async function connectDatabase() {
  await sequelize.authenticate();
  console.log('Conexión a Supabase establecida correctamente.');
}

module.exports = {
  sequelize,
  connectDatabase
};
