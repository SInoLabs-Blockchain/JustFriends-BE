import { Sequelize } from 'sequelize';
import ChallengeModel from './models/ChallengeModel.js';
import UserModel from './models/UserModel.js';
import PostModel from './models/PostModel.js';
import PostViewModel from './models/PostViewModel.js';

const sequelize = new Sequelize(process.env.DATABASE_URL);

const Challenge = ChallengeModel(sequelize);
const User = UserModel(sequelize);
const Post = PostModel(sequelize);
const PostView = PostViewModel(sequelize);

// Set up relationships
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Post.hasMany(PostView, { foreignKey: 'postId', as: 'views' });
PostView.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

const models = {
  Challenge,
  User,
  Post,
  PostView,
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

export { sequelize, models };