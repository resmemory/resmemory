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
    contentId: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reportType: {
      type: DataTypes.ENUM({
        values: ['post', 'comment', 'thread'],
      }),
      allowNull: false,
    },
    isReport: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Reports',
    timestamps: true,
    updatedAt: false,
  },
);
export default Reports;
