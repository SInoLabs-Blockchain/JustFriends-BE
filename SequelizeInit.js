const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://myuser:mypassword@localhost:5432/mydb');

const ChallengeModel = require('./models/ChallengeModel')(sequelize);
const UserModel = require('./models/UserModel')(sequelize);
const PostModel = require('./models/PostModel')(sequelize);
const PostViewModel = require('./models/PostViewModel')(sequelize);

// Thiết lập mối quan hệ
UserModel.hasMany(PostModel, { foreignKey: 'userId', as: 'posts' });
PostModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });

PostModel.hasMany(PostViewModel, { foreignKey: 'postId', as: 'views' });
PostViewModel.belongsTo(PostModel, { foreignKey: 'postId', as: 'post' });

const models = {
  Challenge: ChallengeModel,
  User: UserModel,
  Post: PostModel,
  PostView: PostViewModel,
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
