const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Post extends Model {}
    Post.init({
        postId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        contentHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('paid', 'free'),
            allowNull: false
        },
        preview: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
        timestamps: true,
    });

    return Post;
}

