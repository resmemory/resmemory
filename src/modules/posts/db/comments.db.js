import sequelize from './posts.init';
import { Model, DataTypes } from 'sequelize';
class Comments extends Model {}

Comments.init(
  {
    commentId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    postId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Comments',
    timestamps: true,
    paranoid: true,
  },
);
export default Comments;
