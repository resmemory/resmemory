import Users from './db/users.db';
import Bookmarks from './db/bookmarks.db';
import bcrypt from 'bcrypt';
import redisCli from '../../redis';
import jwt from 'jsonwebtoken';
import signup from './signup.service';
import usersmodule from './users.module';
import dataconnection from '../connection';

const onRequest = async (res, method, pathname, params, key, cb) => {
  let token;
  let responseData = {};
  const query = params.query;

  // POST
  switch (method) {
    case 'POST':
      // 회원 가입 관련 함수 호출
      if (pathname == '/mail' || pathname == '/verified' || pathname == '/signup') {
        responseData = await signup(pathname, params, responseData, token);
      }

      // 로그아웃
      if (pathname == '/logout') {
        responseData = { code: 131 };
      }

      // 로그인
      if (pathname == '/login') {
        try {
          const { email, password } = params.bodies;

          const user = await Users.findOne({ where: { email } });
          const isValidPassword = await bcrypt.compare(password, user.password);
          let refresh = params.bodies.refresh;
          const today = Date.now();

          if (!isValidPassword) {
            responseData = { code: 122 };
          } else if (refresh) {
            const verified = jwt.verify(refresh, process.env.JWT_SECRET_KEY_REFRESH);
            if (today - jwt.decode(refresh).exp > 0) {
              if (verified && redisCli.get(`refresh_${user.userId}`) == refresh) {
                token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
                  expiresIn: process.env.JWT_EXPIRE_TIME,
                });
                responseData = { code: 121 };
              } else {
                responseData = { code: 122 };
              }
            } else {
              if (verified) {
                refresh = jwt.sign({ ok: 'ok' }, process.env.JWT_SECRET_KEY_REFRESH, {
                  expiresIn: process.env.JWT_EXPIRE_TIME_REFRESH,
                });
                token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
                  expiresIn: process.env.JWT_EXPIRE_TIME,
                });
                responseData = { code: 123, refresh, token };
              }
            }
          } else {
            refresh = jwt.sign({ ok: 'ok' }, process.env.JWT_SECRET_KEY_REFRESH, {
              expiresIn: process.env.JWT_EXPIRE_TIME_REFRESH,
            });
            token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
              expiresIn: process.env.JWT_EXPIRE_TIME,
            });
            redisCli.set(`refresh_${user.userId}`, `${refresh}`);
            responseData = { code: 123, refresh, token };
          }
        } catch (err) {
          console.log(err);
          responseData = { code: 120 };
        }
      }

      // 북마크 추가
      if (pathname == '/bookmarks') {
        try {
          const { postId } = params.bodies;
          const { userId } = params;

          const findbookmark = await Bookmarks.findOne({ where: { postId, userId } });
          if (findbookmark) {
            responseData = { code: 224 };
          } else {
            if (postId) {
              const result = await Bookmarks.create({ userId, postId });
              responseData = { code: 221 };
              if (!result) {
                responseData = { code: 223 };
              }
            } else {
              responseData = { code: 222 };
            }
          }
        } catch (err) {
          responseData = { code: 220 };
        }
      }

      return post(
        method,
        pathname,
        params,
        key,
        (response) => {
          process.nextTick(cb, res, response);
        },
        responseData,
      );

    // GET
    case 'GET':
      // 내 정보 조회
      if (pathname == '/users' && !query.userId && !query.userIds) {
        try {
          const { userId } = params;
          const result = await Users.findByPk(userId, {
            attributes: { exclude: ['password', 'kakaoId', 'deletedAt'] },
          });
          responseData = { bodies: result, code: 171 };
        } catch (err) {
          responseData = { code: 170, bodies: null };
        }
      }

      // 회원 조회 (게시글 상세 조회용)
      if (pathname == '/users' && query.userId && !query.userIds) {
        try {
          const result = await Users.findByPk(query.userId, {
            attributes: ['userId', 'nickname'],
            raw: true,
          });
          responseData = { bodies: result, code: 1711 };
        } catch (err) {
          responseData = { code: 1701, bodies: null };
        }
      }

      // 회원 조회 (게시글 전체 조회, 댓글 조회용)
      if (pathname == '/users' && !query.userId && query.userIds) {
        try {
          let userIds = query.userIds;
          if (typeof userIds == 'string') {
            userIds = userIds.replace('[', '');
            userIds = userIds.replace(']', '');
            userIds = userIds.split(',');
          }

          const result = await Users.findAll({
            where: { userId: userIds },
            attributes: ['userId', 'nickname'],
            raw: true,
          });
          responseData = { bodies: result, code: 1712 };
        } catch (err) {
          responseData = { code: 1702, bodies: null };
        }
      }

      // 북마크 전체 조회
      if (pathname === '/bookmarks') {
        try {
          const { userId } = params;
          const bookmarks = await Bookmarks.findAll({ order: ['createdAt'], where: { userId } });
          const postIds = bookmarks.map((bookmark) => bookmark.postId);
          const userIds = bookmarks.map((bookmark) => bookmark.userId);
          const users = await Users.findAll({
            where: { userId: userIds },
            attributes: ['userId', 'nickname'],
          });

          await new Promise((resolve, reject) => {
            dataconnection(
              process.env.HOST,
              process.env.POSTS_PORT,
              (data) => {
                usersmodule.posts = data;
                resolve();
              },
              { postIds },
              null,
              userId,
              'GET',
              '/posts',
            );
          });

          const bodies = usersmodule.posts.responseData.bodies.map((post) => {
            const bookmarkId = bookmarks.filter((bookmark) => post.postId == bookmark.postId);
            const nickname = users.filter((user) => user.userId == post.userId);
            return {
              ...post,
              bookmarkId: bookmarkId[0].bookmarkId,
              nickname: nickname.nickname,
            };
          });

          responseData = { code: 211, bodies };
        } catch (err) {
          console.log(err);
          responseData = { code: 210, bodies: null };
        }
      }

      return get(
        method,
        pathname,
        params,
        key,
        (response) => {
          process.nextTick(cb, res, response);
        },
        responseData,
      );

    case 'PATCH':
      // 닉네임 수정
      if (params.params == 'nickname') {
        try {
          const { nickname } = params.bodies;
          const { userId } = params;
          if (!nickname) {
            responseData = { code: 153 };
          }
          const target = await Users.findOne({ where: { nickname } });
          if (target) {
            responseData = { code: 154 };
          }
          const result = await Users.update(
            {
              nickname,
            },
            { where: { userId } },
          );
          if (result) {
            responseData = { code: 151 };
          } else {
            responseData = { code: 152 };
          }
        } catch (err) {
          responseData = { code: 150 };
          console.log(err);
        }
      }

      // 비밀번호 수정
      if (params.params == 'password') {
        try {
          const { password, confirm } = params.bodies;
          const { userId } = params;
          if (!password || !confirm) {
            responseData = { code: 164 };
          } else if (password !== confirm) {
            responseData = { code: 163 };
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          const result = await Users.update(
            {
              password: hashedPassword,
            },
            { where: { userId } },
          );
          if (result) {
            responseData = { code: 161 };
          } else {
            responseData = { code: 162 };
          }
        } catch (err) {
          responseData = { code: 160 };
        }
      }

      return patch(
        method,
        pathname,
        params,
        key,
        (response) => {
          process.nextTick(cb, res, response);
        },
        responseData,
      );

    case 'DELETE':
      // 회원 탈퇴
      if (pathname == '/users') {
        try {
          const { message } = params.bodies;
          const { userId } = params;
          if (message == '회원 탈퇴를 희망합니다.') {
            const result = await Users.destroy({ where: { userId } });

            await new Promise((resolve, reject) => {
              dataconnection(
                process.env.HOST,
                process.env.POSTS_PORT,
                (data) => {
                  resolve();
                },
                null,
                'posts',
                userId,
                'DELETE',
                '/signout',
              );
            });
            await new Promise((resolve, reject) => {
              dataconnection(
                process.env.HOST,
                process.env.POSTS_PORT,
                (data) => {
                  resolve();
                },
                null,
                'comments',
                userId,
                'DELETE',
                '/signout',
              );
            });
            if (result) {
              responseData = { code: 141 };
            } else {
              responseData = { code: 143 };
            }
          } else {
            responseData = { code: 142 };
          }
        } catch (error) {
          responseData = { code: 140 };
        }
      }

      // 북마크 삭제
      if (pathname == '/bookmarks') {
        try {
          const { userId } = params;
          const bookmarkId = params.params;
          const target = await Bookmarks.findByPk(bookmarkId);
          if (!bookmarkId) {
            responseData = { code: 233 };
          }
          if (target.userId !== userId) {
            responseData = { code: 234 };
          }
          const result = await Bookmarks.destroy({ where: { bookmarkId } });
          if (result) {
            responseData = { code: 231 };
          } else {
            responseData = { code: 232 };
          }
        } catch (err) {
          responseData = { code: 230 };
        }
      }

      return remove(
        method,
        pathname,
        params,
        key,
        (response) => {
          process.nextTick(cb, res, response);
        },
        responseData,
      );
    default:
      return process.nextTick(cb, res, null);
  }
};

function get(method, pathname, params, key, cb, responseData) {
  const response = {
    key,
    errorCode: 0,
    errormessage: 'success',
    responseData,
  };

  cb(response);
}

function post(method, pathname, params, key, cb, responseData) {
  const response = {
    key,
    errorCode: 0,
    errormessage: 'success',
    responseData,
  };
  cb(response);
}
function patch(method, pathname, params, key, cb, responseData) {
  const response = {
    key,
    errorCode: 0,
    errormessage: 'success',
    responseData,
  };
  cb(response);
}
function remove(method, pathname, params, key, cb, responseData) {
  const response = {
    key,
    errorCode: 0,
    errormessage: 'success',
    responseData,
  };
  cb(response);
}

export default onRequest;
