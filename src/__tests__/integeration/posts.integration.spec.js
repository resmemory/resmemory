import sequelize from '../../modules/posts/db/posts.init';
import postsmodule from '../../modules/posts/posts.module';

beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    await sequelize.sync();
  } else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});
describe('POST /api/posts', () => {
  test('게시글 작성', async () => {
    let result;
    await new Promise((resolve, reject) => {
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

afterAll(async () => {
  if (process.env.NODE_ENV === 'test') await sequelize.sync({ force: true });
  else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});
