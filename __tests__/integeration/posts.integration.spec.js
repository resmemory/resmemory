import sequelize from '../../src/modules/posts/db/posts.init';
import mockPostModule from './mock.posts.module';
import Users from '../../src/modules/users/db/users.db';
import bcrypt from 'bcrypt';
beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    await sequelize.sync();
  } else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
  const hashedPassword = await bcrypt.hash('testtest1234', 10);
  await Users.create({ email: 'test@test.com', password: hashedPassword, nickname: 'test' });
});
describe('POST /api/posts', () => {
  test('게시글 작성', async () => {
    let result;
    await new Promise((resolve, reject) => {
      mockPostModule.dataconnection(
        process.env.HOST,
        process.env.MOCK_POSTS_PORT,
        (data) => {
          result = data;
          resolve();
        },
        {},
        {},
        {
          title: '테스트',
          content: '테스트',
          category: '1990',
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
  test('게시글 전체 조회', async () => {
    let result;
    await new Promise((resolve, reject) => {
      mockPostModule.dataconnection(
        process.env.HOST,
        process.env.MOCK_POSTS_PORT,
        (data) => {
          result = data;
          resolve();
        },
        { pageNum: 1, sort: 'view' },
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
          category: '1990',
          content: '테스트',
          createdAt: expect.any(String),
          deletedAt: null,
          img: null,
          nickname: 'test',
          postId: 1,
          thumbnail: null,
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
  if (process.env.NODE_ENV === 'test') await sequelize.sync({ force: true });
  else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});
