const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.PGDATABASE,      // o DB_NAME
  process.env.PGUSER,          // o DB_USER
  process.env.PGPASSWORD,      // o DB_PASSWORD
  {
    host: process.env.PGHOST,  // o DB_HOST
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // <-- necesario para Neon, Render y otros
      },
    },
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ Conectado correctamente a PostgreSQL en Neon'))
  .catch(err => console.error('❌ Error al conectar a la base de datos:', err));

module.exports = sequelize;
