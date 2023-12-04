import sequelize from '../../src/modules/threads/db/threads.init';
import mockThreadsModule from './mock.threads.module';
import Users from '../../src/modules/users/db/users.db';
import bcrypt from 'bcrypt';

beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    await sequelize.sync();
  } else {
    throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
  }
  const hashedPassword = await bcrypt.hash('testtest1234', 10);

  await Users.create({ email: 'test@test.com', password: hashedPassword, nickname: 'test' });
});

describe('POST /api/threads', () => {
  test('/threads', async () => {
    let result;
    await new Promise((resolve, reject) => {
      mockThreadsModule.dataconnection(
        process.env.HOST,
        process.env.MOCK_THREADS_PORT,
        (data) => {
          result = data;
          resolve();
        },
        null,
        null,
        { content: 'New thread' },
        1,
        'POST',
        '/threads',
      );
    });

    expect(result).toEqual({
      errorCode: 0,
      errormessage: 'success',
      key: 0,
      responseData: {
        code: 721,
      },
    });
  });
});
describe('GET /api/threads', () => {
  test('/threads', async () => {
    let result;
    await new Promise((resolve, reject) => {
      mockThreadsModule.dataconnection(
        process.env.HOST,
        process.env.MOCK_THREADS_PORT,
        (data) => {
          result = data;
          resolve();
        },
        null,
        null,
        { result },
        1,
        'GET',
        '/threads',
      );
    });

    expect(result).toEqual({
      errorCode: 0,
      errormessage: 'success',
      key: 0,
      responseData: {
        result: [
          {
            content: 'New thread',
            createdAt: expect.any(String),
            deletedAt: null,
            threadId: 1,
            userId: 1,
          },
        ],
      },
    });
  });
});

describe('DELETE /api/threads', () => {
  test('/threads', async () => {
    let result;
    await new Promise((resolve, reject) => {
      mockThreadsModule.dataconnection(
        process.env.HOST,
        process.env.MOCK_THREADS_PORT,
        (data) => {
          result = data;
          resolve();
        },
        null,
        1,
        null,
        1,
        'DELETE',
        '/threads',
      );
    });

    expect(result).toEqual({
      errorCode: 0,
      errormessage: 'success',
      key: 0,
      responseData: {
        code: 731,
      },
    });
  });
});

afterAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    await sequelize.sync({ force: true });
  } else {
    throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
  }
});
