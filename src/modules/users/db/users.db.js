import sequelize from './users.init';
import { Model, DataTypes } from 'sequelize';
class Users extends Model {}

Users.init(
  {
    userId: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false },
    nickname: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    kakaoId: { type: DataTypes.BIGINT, defaultValue: null },
  },
  {
    sequelize,
    modelName: 'Users',
    timestamps: true,
    paranoid: true,
  },
);
export default Users;
