import sequelize from './threads.init';
import { Model, DataTypes } from 'sequelize';
class Threads extends Model {}

Threads.init(
  {
    threadId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
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
    modelName: 'Threads',
    timestamps: true,
    updatedAt: false,
    paranoid: true,
  },
);
export default Threads;
