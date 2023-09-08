import sequelize from '../../modules/threads/db/threads.init';
import threadsmodule from '../../modules/threads/threads.module';
import Threads from '../../modules/threads/db/threads.db';
beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    await sequelize.sync();
  } else {
    throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
  }
  Threads.create({ content: '테스트', userId: 1 });
});

describe('POST /api/threads', () => {
  test('/threads', async () => {
    let result;
    await new Promise((resolve, reject) => {
      threadsmodule.dataconnection(
        process.env.HOST,
        process.env.THREADS_PORT,
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
      threadsmodule.dataconnection(
        process.env.HOST,
        process.env.THREADS_PORT,
        (data) => {
          result = data;
          resolve();
        },
        null,
        null,
        null,
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
            content: '테스트',
            createdAt: expect.any(String),
            deletedAt: null,
            threadId: 1,
          },
          {
            content: 'New thread',
            createdAt: expect.any(String),
            deletedAt: null,
            threadId: 2,
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
      threadsmodule.dataconnection(
        process.env.HOST,
        process.env.THREADS_PORT,
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
