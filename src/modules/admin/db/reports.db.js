import sequelize from './reports.init';
import { Model, DataTypes } from 'sequelize';
class Reports extends Model {}

Reports.init(
  {
    reportId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    postId: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    commentId: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    threadId: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Report',
    timestamps: true,
    updatedAt: false,
  },
);
export default Reports;
