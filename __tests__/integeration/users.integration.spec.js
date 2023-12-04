import sequelize from '../../src/modules/users/db/users.init';
import mockUsersModule from './mock.users.module';
import Users from '../../src/modules/users/db/users.db';
import bcrypt from 'bcrypt';
import redisCli from '../../src/redis';

beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    await sequelize.sync();
  } else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');

  const hashedPassword = await bcrypt.hash('testtest1234', 10);

  await Users.create({ email: 'test@test.com', password: hashedPassword, nickname: 'test' });
});
describe('GET /api/users', () => {
  test('내 정보 조회', async () => {
    let result;
    await new Promise((resolve, reject) => {
      mockUsersModule.dataconnection(
        process.env.HOST,
        process.env.MOCK_USERS_PORT,
        (data) => {
          result = data;
          resolve();
        },
        {},
        {},
        {},
        1,
        'GET',
        '/users',
      );
    });

    expect(result).toEqual({
      key: 0,
      errorCode: 0,
      errormessage: 'success',
      responseData: {
        bodies: {
          userId: 1,
          email: 'test@test.com',
          nickname: 'test',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        code: 171,
      },
    });
  });
  test('내 정보 조회 실패 : userId 없음', async () => {
    let result;
    await new Promise((resolve, reject) => {
      mockUsersModule.dataconnection(
        process.env.HOST,
        process.env.MOCK_USERS_PORT,
        (data) => {
          result = data;
          resolve();
        },
        {},
        {},
        {},
        0,
        'GET',
        '/users',
      );
    });

    expect(result).toEqual({
      key: 0,
      errorCode: 0,
      errormessage: 'success',
      responseData: {
        code: 0,
      },
    });
  });
});

describe('POST /api/mail', () => {
  test('메일 전송 실패 : 이메일 형식', async () => {
    let result;
    await new Promise((resolve, reject) => {
      mockUsersModule.dataconnection(
        process.env.HOST,
        process.env.MOCK_USERS_PORT,
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
      mockUsersModule.dataconnection(
        process.env.HOST,
        process.env.MOCK_USERS_PORT,
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

  test('메일 전송 성공', async () => {
    let result;
    await new Promise((resolve, reject) => {
      mockUsersModule.dataconnection(
        process.env.HOST,
        process.env.MOCK_USERS_PORT,
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
});

describe('POST /api/verified', () => {
  test('번호 인증 성공', async () => {
    let result;
    const receiveNumber = await redisCli.get('verifyNumber_teamresmemory@gmail.com');
    await new Promise((resolve, reject) => {
      mockUsersModule.dataconnection(
        process.env.HOST,
        process.env.MOCK_USERS_PORT,
        (data) => {
          result = data;
          resolve();
        },
        null,
        null,
        {
          receiveNumber,
          email: 'teamresmemory@gmail.com',
        },
        null,
        'POST',
        '/verified',
      );
    });

    expect(result).toEqual({
      errorCode: 0,
      errormessage: 'success',
      key: 0,
      responseData: {
        code: 193,
      },
    });
  });
  test('번호 인증 실패', async () => {
    let result;
    const receiveNumber = await redisCli.get('verifyNumber_teamresmemory@gmail.com');
    await new Promise((resolve, reject) => {
      mockUsersModule.dataconnection(
        process.env.HOST,
        process.env.MOCK_USERS_PORT,
        (data) => {
          result = data;
          resolve();
        },
        null,
        null,
        {
          receiveNumber: 123456789,
          email: 'teamresmemory@gmail.com',
        },
        null,
        'POST',
        '/verified',
      );
    });

    expect(result).toEqual({
      errorCode: 0,
      errormessage: 'success',
      key: 0,
      responseData: {
        code: 191,
      },
    });
  });
});

afterAll(async () => {
  if (process.env.NODE_ENV === 'test') await sequelize.sync({ force: true });
  else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});
