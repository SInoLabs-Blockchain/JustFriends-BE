const express = require('express');
const { Sequelize } = require('sequelize');
const UserRoute = require('./routes/UserRoute');
const bodyParser = require('body-parser');

const app = express();
const sequelize = new Sequelize('postgres://myuser:mypassword@localhost:5432/mydb');

app.use(bodyParser.json());
app.use('/user', UserRoute);

sequelize.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.error('Unable to connect to the database:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});