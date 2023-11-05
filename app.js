const express = require('express');
const { Sequelize } = require('sequelize');
const UserRoute = require('./routes/UserRoute');
const PostRoute = require('./routes/PostRoute');
const authMiddleware = require('./middlewares/AuthMiddleware');
const bodyParser = require('body-parser');

const app = express();
const sequelize = new Sequelize('postgres://myuser:mypassword@localhost:5432/mydb');

require('dotenv').config();

app.use(bodyParser.json());

app.use(authMiddleware);

app.use('/api', UserRoute);
app.use('/api', PostRoute); 

sequelize.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.error('Unable to connect to the database:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});