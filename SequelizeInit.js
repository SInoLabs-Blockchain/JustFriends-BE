const { Sequelize } = require('sequelize');
const ChallengeModel = require('./models/ChallengeModel');
const UserModel = require('./models/UserModel');

const sequelize = new Sequelize('postgres://myuser:mypassword@localhost:5432/mydb');

const models = {
  Challenge: ChallengeModel(sequelize),
  User: UserModel(sequelize)
  // ... any other models
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

sequelize.sync({ force: false }) // Set to true to update the table on every initialization
  .then(() => {
    console.log('Database & tables created!');
  });

module.exports = {
  sequelize,
  models,
};
