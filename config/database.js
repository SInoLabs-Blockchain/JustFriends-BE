// config/database.js

const { Sequelize } = require('sequelize');

// Set up a connection to the PostgreSQL database
const sequelize = new Sequelize({
  dialect: 'postgres',     // Database type
  host: 'localhost',        // Database host address (from Docker Compose)
  username: 'myuser',      // PostgreSQL username
  password: 'mypassword',  // PostgreSQL password
  database: 'mydb',        // Database name
  port: 5432,              // PostgreSQL port (usually 5432)
});

// Check the database connection
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

testDatabaseConnection();

module.exports = sequelize;
