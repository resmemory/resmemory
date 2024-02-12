import Users from './db/users.db';
import Bookmarks from './db/bookmarks.db';
import bcrypt from 'bcrypt';
import redisCli from '../../redis';
import jwt from 'jsonwebtoken';
import signup from './signup.service';
import usersmodule from './users.module';
import dotenv from 'dotenv';
import sequelize from './db/users.init';
import { isArray } from 'lodash';

dotenv.config();

const onRequest = async (res, method, pathname, params, key, cb) => {
  let token;
  let responseData = {};
  const query = params.query;

  // POST
  switch (method) {
    case 'POST':
      // 회원 가입 관련 함수 호출
      if (
        pathname == '/mail' ||
        pathname == '/verified' ||
        pathname == '/signup' ||
        pathname == '/oauth'
      ) {
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

          if (!user) {
            responseData = { code: 122 };
          } else {
            const isValidPassword = await bcrypt.compare(password, user.password);
            const nickname = user.nickname;
            if (!isValidPassword) {
              responseData = { code: 122 };
            } else {
              let refresh = params.bodies.refresh;
              const today = Date.now();
              if (refresh) {
                if (today - jwt.decode(refresh).exp > 0) {
                  const verified = jwt.verify(refresh, process.env.JWT_SECRET_KEY_REFRESH);
                  if (verified && redisCli.get(`refresh_${user.userId}`) == refresh) {
                    token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
                      expiresIn: process.env.JWT_EXPIRE_TIME,
                    });
                    responseData = { code: 121 };
                  } else {
                    responseData = { code: 122 };
                  }
                } else {
                  if (redisCli.get(`refresh_${user.userId}`) == refresh) {
                    refresh = jwt.sign({ ok: 'ok' }, process.env.JWT_SECRET_KEY_REFRESH, {
                      expiresIn: process.env.JWT_EXPIRE_TIME_REFRESH,
                    });
                    token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
                      expiresIn: process.env.JWT_EXPIRE_TIME,
                    });
                    responseData = { code: 123, refresh, token, nickname };
                  } else {
                    responseData = { code: 122 };
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
                responseData = { code: 123, refresh, token, nickname };
              }
            }
          }
        } catch (err) {
          console.log(err);
          responseData = { code: 120 };
        }
      }

      // 카카오 JS key
      if (pathname == '/kakaokey') {
        responseData = {
          kakaoJSkey: process.env.KAKAO_JS_KEY,
          grantType: process.env.KAKAO_GRANT_TYPE,
          kakaoClientId: process.env.KAKAO_CLIENT_ID,
          kakaoSecretKey: process.env.KAKAO_CLIENT_SECRET,
          kakaoRedirectURI: process.env.KAKAO_REDIRECT_URI,
        };
      }

      // 카카오 로그인
      if (pathname == '/kakaoLogin') {
        try {
          const { kakaoId } = params.bodies;

          const user = await Users.findOne({ where: { kakaoId } });
          const nickname = user.nickname;
          if (!user) {
            responseData = { code: 122 };
          } else {
            let refresh = params.bodies.refresh;
            const today = Date.now();
            if (refresh) {
              if (today - jwt.decode(refresh).exp > 0) {
                const verified = jwt.verify(refresh, process.env.JWT_SECRET_KEY_REFRESH);
                if (verified && redisCli.get(`refresh_${user.userId}`) == refresh) {
                  token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
                    expiresIn: process.env.JWT_EXPIRE_TIME,
                  });
                  responseData = { code: 121 };
                } else {
                  responseData = { code: 122 };
                }
              } else {
                if (redisCli.get(`refresh_${user.userId}`) == refresh) {
                  refresh = jwt.sign({ ok: 'ok' }, process.env.JWT_SECRET_KEY_REFRESH, {
                    expiresIn: process.env.JWT_EXPIRE_TIME_REFRESH,
                  });
                  token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
                    expiresIn: process.env.JWT_EXPIRE_TIME,
                  });
                  responseData = { code: 123, refresh, token, nickname };
                } else {
                  responseData = { code: 122 };
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
              responseData = { code: 123, refresh, token, nickname };
            }
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
          if (!userId) {
            responseData = { code: 0 };
          }
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
          if (!params.userId) {
            responseData = { code: 0 };
          } else {
            const { userId } = params;

            const result = await Users.findByPk(userId, {
              attributes: { exclude: ['password', 'kakaoId', 'deletedAt'] },
            });
            responseData = { bodies: result, code: 171 };
          }
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
          const { pageNum } = params.query;
          if (!userId) {
            responseData = { code: 0 };
          }
          const bookmarks = await Bookmarks.findAll({
            order: ['createdAt'],
            where: { userId },
            limit: 12,
            offset: (pageNum - 1) * 12,
          });
          const postIds = bookmarks.map((bookmark) => bookmark.postId);

          let sqlQuery;
          let postIdString;
          if (postIds.length > 1) {
            postIdString = postIds.join(',');
            sqlQuery = `SELECT postId, count(*) as count from Bookmarks WHERE postId IN (${postIdString}) GROUP BY postId`;
          } else {
            sqlQuery = `SELECT COUNT(*) as count from Bookmarks WHERE postId = ${postIds[0]}`;
          }

          let bookmarksCounts;
          if (postIds) {
            bookmarksCounts = await sequelize.query(sqlQuery);
          }

          await new Promise((resolve, reject) => {
            usersmodule.dataconnection(
              process.env.HOST,
              process.env.POSTS_PORT,
              (data) => {
                usersmodule.posts = data;
                resolve();
              },
              { postIds },
              null,
              null,
              userId,
              'GET',
              '/posts',
            );
          });
          let bodies = usersmodule.posts.responseData.bodies;
          const userIds = bodies.map((post) => post.userId);
          const users = await Users.findAll({
            where: { userId: userIds },
            attributes: ['userId', 'nickname'],
          });

          let result = bodies
            .map((post) => {
              const bookmark = bookmarks.filter((bookmark) => post.postId == bookmark.postId);
              const nickname = users.filter((user) => user.userId == post.userId);
              const count = bookmarksCounts[0].filter((bookmark) => bookmark.postId == post.postId);

              return {
                ...post,
                bookmarks: count[0].count,
                bookmarkId: bookmark[0].bookmarkId,
                nickname: nickname[0].nickname,
                order: bookmark[0].createdAt,
              };
            })
            .sort((prev, next) => next.order - prev.order);

          responseData = result;
        } catch (err) {
          console.log(err);
          responseData = { code: 210, result: null };
        }
      } else if (pathname == '/counts') {
        try {
          const { postIds } = params.query;
          let sqlQuery;
          let postIdString;
          if (Array.isArray(postIds)) {
            postIdString = postIds.join(',');
            sqlQuery = `SELECT postId, count(*) as count from Bookmarks WHERE postId IN (${postIdString}) GROUP BY postId`;
          } else {
            sqlQuery = `SELECT COUNT(*) as count from Bookmarks WHERE postId = ${postIds}`;
          }

          let bookmarks;
          if (postIds) {
            bookmarks = await sequelize.query(sqlQuery);
          }

          responseData = { code: 211, result: bookmarks };
        } catch (err) {
          console.log(err);
          responseData = { code: 210, result: null };
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
          if (!userId) {
            responseData = { code: 0 };
          } else if (!nickname) {
            responseData = { code: 153 };
          } else {
            const target = await Users.findOne({ where: { nickname } });
            if (target) {
              responseData = { code: 154 };
            } else {
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
            }
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
          const passwordcheck = /^[A-Za-z0-9@$!%*#?&]{6,12}$/;
          if (!userId) {
            responseData = { code: 0 };
          }

          if (!password || !confirm) {
            responseData = { code: 164 };
          } else if (password !== confirm) {
            responseData = { code: 163 };
          } else if (!passwordcheck.test(password)) {
            responseData = { code: 114 };
          } else {
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
          if (!userId) {
            responseData = { code: 0 };
          }
          if (message == '회원 탈퇴를 희망합니다.') {
            const result = await Users.destroy({ where: { userId } });
            await Bookmarks.destroy({ where: { userId } });
            await new Promise((resolve, reject) => {
              usersmodule.dataconnection(
                process.env.HOST,
                process.env.POSTS_PORT,
                (data) => {
                  resolve();
                },
                null,
                'posts',
                null,
                userId,
                'DELETE',
                '/signout',
              );
            });
            await new Promise((resolve, reject) => {
              usersmodule.dataconnection(
                process.env.HOST,
                process.env.POSTS_PORT,
                (data) => {
                  resolve();
                },
                null,
                'comments',
                null,
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
          if (!userId) {
            responseData = { code: 0 };
          }
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
