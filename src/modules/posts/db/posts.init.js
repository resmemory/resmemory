import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let database = 'resmemory';
if (process.env.NODE_ENV == 'testpost') {
  database = 'resmemory_test';
}

const sequelize = new Sequelize({
  database,
  username: process.env.POSTS_MYSQL_USER_NAME,
  port: '3306',
  password: process.env.POSTS_MYSQL_PASSWORD,
  host: process.env.POSTS_MYSQL_HOST,
  dialect: 'mysql',
});
export default sequelize;
