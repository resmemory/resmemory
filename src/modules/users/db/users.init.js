import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
let database = 'resmemory';
if (process.env.NODE_ENV == 'test') {
  database = 'resmemory_test';
}

const sequelize = new Sequelize({
  database: database,
  username: process.env.USERS_MYSQL_USER_NAME,
  port: '3306',
  password: process.env.USERS_MYSQL_PASSWORD,
  host: process.env.USERS_MYSQL_HOST,
  dialect: 'mysql',
});
export default sequelize;
