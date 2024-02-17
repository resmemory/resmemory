import sequelize from './posts.init';
import { Model, DataTypes } from 'sequelize';
class Posts extends Model {}

Posts.init(
  {
    postId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    viewCount: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['1970', '1980', '1990', '2000', '2010', '2020', 'notice'],
    },
  },
  {
    sequelize,
    modelName: 'Posts',
    timestamps: true,
    paranoid: true,
  },
);
export default Posts;
