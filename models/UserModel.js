import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class User extends Model {}

  User.init({
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
    sequelize,
    tableName: 'users',
    hooks: {
      beforeCreate: (user) => {
        console.log("user", user);
        if (!user.username) {
          user.username = `${user.walletAddress}@${user.userId}`;
        }
      }
    }

  });

  return User;
}