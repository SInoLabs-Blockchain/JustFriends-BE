import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class PostView extends Model {}

    PostView.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        viewedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'PostView',
        tableName: 'post_views',
        timestamps: false
    });

    return PostView;
}