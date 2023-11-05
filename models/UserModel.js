const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    walletAddress: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    avatarUrl: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    coverUrl: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users'
  });

  User.beforeCreate((user, _) => {
    if (!user.username) {
      user.username = `${user.walletAddress}@${user.userId}`;
    }
  });

  return User;
};
