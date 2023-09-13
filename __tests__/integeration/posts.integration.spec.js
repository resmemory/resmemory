import sequelize from '../../src/modules/posts/db/posts.init';
import postsmodule from '../../src/modules/posts/posts.module';
import usersmodule from '../../src/modules/users/users.module';
beforeAll(async () => {
  if (process.env.NODE_ENV === 'testpost') {
    await sequelize.sync();
  } else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});
describe('POST /api/posts', () => {
  test('게시글 작성', async () => {
    let result;
    await new Promise((resolve, reject) => {
      usersmodule;
      postsmodule.dataconnection(
        process.env.HOST,
        process.env.POSTS_PORT,
        (data) => {
          result = data;
          resolve();
        },
        {},
        {},
        {
          title: '테스트',
          content: '테스트',
          annualCategory: '1990',
          img: { size: 0 },
        },
        1,
        'POST',
        '/posts',
      );
    });

    expect(result).toEqual({
      key: 0,
      errorCode: 0,
      errormessage: 'success',
      responseData: {
        code: 311,
      },
    });
  });
});

describe('GET /api/posts', () => {
  test('게시글 조회', async () => {
    let result;
    await new Promise((resolve, reject) => {
      postsmodule.dataconnection(
        process.env.HOST,
        process.env.POSTS_PORT,
        (data) => {
          result = data;
          resolve();
        },
        { pageNum: 1 },
        {},
        {},
        {},
        'GET',
        '/posts',
        'true',
      );
    });

    expect(result).toEqual({
      errorCode: 0,
      errormessage: 'success',
      key: 0,
      responseData: [
        {
          annualCategory: '1990',
          content: '테스트',
          createdAt: expect.any(String),
          deletedAt: null,
          img: null,
          nickname: '테스트',
          postId: 1,
          title: '테스트',
          updatedAt: expect.any(String),
          userId: 1,
          viewCount: 0,
        },
      ],
    });
  });
});

afterAll(async () => {
  if (process.env.NODE_ENV === 'testpost') await sequelize.sync({ force: true });
  else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});
