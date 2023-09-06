import sequelize from '../../db/threads.init';
import threadsmodule from '../../threads.module';
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

// describe('DELETE /api/threads', () => {
//   it('should delete a thread when path is /threads', async () => {
//     const res = {};
//     const method = 'DELETE';
//     const pathname = '/threads';
//     const params = { userId: 1, params: 1 };
//     const key = 'testKey';

//     const response = await onRequest(res, method, pathname, params, key);

//     expect(response.errorCode).toBe(0);
//     expect(response.responseData).toEqual({ code: 731 });
//   });
// });

afterAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    await sequelize.sync({ force: true });
  } else {
    throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
  }
});
