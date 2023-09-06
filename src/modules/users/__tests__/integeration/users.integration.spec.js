import sequelize from '../../db/users.init';
import usersmodule from '../../users.module';
import Users from '../../db/users.db';
import bcrypt from 'bcrypt';

beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    await sequelize.sync();
  } else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');

  const hashedPassword = await bcrypt.hash('test', 10);
  await Users.create({ email: 'test@test.com', password: 'test1234', nickname: hashedPassword });
});
describe('POST /api/mail', () => {
  test('메일 전송 성공', async () => {
    let result;
    await new Promise((resolve, reject) => {
      usersmodule.dataconnection(
        process.env.HOST,
        process.env.USERS_PORT,
        (data) => {
          result = data;
          resolve();
        },
        null,
        null,
        { email: 'teamresmemory@gmail.com' },
        null,
        'POST',
        '/mail',
      );
    });

    expect(result).toEqual({
      errorCode: 0,
      errormessage: 'success',
      key: 0,
      responseData: {
        code: 181,
      },
    });
  });
  test('메일 전송 실패 : 이메일 형식', async () => {
    let result;
    await new Promise((resolve, reject) => {
      usersmodule.dataconnection(
        process.env.HOST,
        process.env.USERS_PORT,
        (data) => {
          result = data;
          resolve();
        },
        null,
        null,
        { email: 'teamresmemorygmail.com' },
        null,
        'POST',
        '/mail',
      );
    });

    expect(result).toEqual({
      errorCode: 0,
      errormessage: 'success',
      key: 0,
      responseData: {
        code: 113,
      },
    });
  });
  test('메일 전송 실패 : 중복 이메일', async () => {
    let result;
    await new Promise((resolve, reject) => {
      usersmodule.dataconnection(
        process.env.HOST,
        process.env.USERS_PORT,
        (data) => {
          result = data;
          resolve();
        },
        null,
        null,
        { email: 'test@test.com' },
        null,
        'POST',
        '/mail',
      );
    });

    expect(result).toEqual({
      errorCode: 0,
      errormessage: 'success',
      key: 0,
      responseData: {
        code: 182,
      },
    });
  });
});

afterAll(async () => {
  if (process.env.NODE_ENV === 'test') await sequelize.sync({ force: true });
  else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});
