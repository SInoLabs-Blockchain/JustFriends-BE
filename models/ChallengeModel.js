const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Challenge extends Model {}

  Challenge.init({
    challenge_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    wallet_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    challenge_text: {
      type: DataTypes.STRING(1024), // Assuming the challenge text won't be too long
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Challenge',
    tableName: 'challenges',
    timestamps: true,
  });

  return Challenge;
};
