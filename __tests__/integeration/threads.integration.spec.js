<<<<<<< Updated upstream:src/__tests__/integeration/threads.integration.spec.js
import sequelize from '../../modules/threads/db/threads.init';
import threadsmodule from '../../modules/threads/threads.module';
=======
import sequelize from '../../src/modules/threads/db/threads.init';
import threadsmodule from '../../src/modules/threads/threads.module';
import Threads from '../../src/modules/threads/db/threads.db';
>>>>>>> Stashed changes:__tests__/integeration/threads.integration.spec.js
beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    await sequelize.sync();
  } else {
    throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
  }
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
<<<<<<< Updated upstream:src/__tests__/integeration/threads.integration.spec.js
            content: 'New thread',
            createdAt: expect.any(String),
            deletedAt: null,
            threadId: expect.any(Number),
=======
            content: '테스트',
            createdAt: expect.any(String),
            deletedAt: null,
            threadId: 1,
            userId: 1,
          },
          {
            content: 'New thread',
            createdAt: expect.any(String),
            deletedAt: null,
            threadId: 2,
            userId: 1,
>>>>>>> Stashed changes:__tests__/integeration/threads.integration.spec.js
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
        null,
        { result },
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
        result: expect.any(Number),
      },
    });
  });
});

describe('DELETE /api/admin', () => {
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
        { result },
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
        code: 371,
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
