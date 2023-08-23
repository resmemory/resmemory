import { Model, DataTypes } from 'sequelize';
import sequelize from './users.init';

class Bookmarks extends Model {}

Bookmarks.init(
  {
    postId: { type: DataTypes.BIGINT, allowNull: false },
    userId: { type: DataTypes.BIGINT, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Bookmarks',
    timestamps: true,
    updatedAt: false,
  },
);
Bookmarks.removeAttribute('id');
export default Bookmarks;
