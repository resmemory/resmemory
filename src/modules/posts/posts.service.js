import Posts from './db/posts.db';
import Comments from './db/comments.db';
import postModule from './posts.module';
import dotenv from 'dotenv';
import { imageUpload, imageDelete } from './imageManager';

dotenv.config();

const onRequest = async (res, method, pathname, params, key, cb, mock) => {
  let responseData = {};

  switch (method) {
    case 'POST':
      // 게시글 작성
      if (pathname === '/posts') {
        try {
          const { title, content, annualCategory, img } = params.bodies;
          let result = null;

          if (!params.userId) {
            responseData = { code: 312 };
          } else if (!title) {
            responseData = { code: 313 };
          } else if (!content) {
            responseData = { code: 314 };
          } else if (!annualCategory) {
            responseData = { code: 315 };
          } else if (img) {
            result = await imageUpload(img);
          } else {
            await Posts.create({
              title,
              content,
              annualCategory,
              img: result,
              userId: params.userId,
            });
            responseData = { code: 311 };
          }
        } catch (err) {
          responseData = { code: 310 };
        }
      }

      // 댓글 작성
      if (pathname === '/comments') {
        try {
          const { userId } = params;
          const { content, postId } = params.bodies;

          if (!params.userId) {
            responseData = { code: 412 };
          } else if (!content) {
            responseData = { code: 413 };
          } else {
            const findPostData = await Posts.findByPk(postId);
            if (!findPostData) {
              responseData = { code: 414 };
            } else {
              await Comments.create({ content, postId, userId });
              responseData = { code: 411 };
            }
          }
        } catch (err) {
          responseData = { code: 410 };
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

    case 'GET':
      // 게시글 전체 조회
      if (pathname === '/posts' && params.query.pageNum) {
        try {
          const { pageNum } = params.query;
          const result = await Posts.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10,
            offset: (pageNum - 1) * 10,
            raw: true,
          });

          const userIds = result.map((post) => post.userId);
          console.log(mock, '찾았다', process.env.USERS_PORT);
          await new Promise((resolve, reject) => {
            postModule.dataconnection(
              process.env.HOST,
              process.env.USERS_PORT,
              (data) => {
                postModule.nickname = data;
                resolve();
              },
              { userIds },
              null,
              null,
              null,
              'GET',
              '/users',
              mock,
            );
          });

          const bodies = postModule.nickname.responseData.bodies;

          responseData = result.map((post) => {
            const nickname = bodies.filter((nickname) => nickname.userId == post.userId);
            return { ...post, nickname: nickname[0].nickname };
          });
        } catch (err) {
          console.log(err);
          responseData = { code: 320 };
          console.log(err);
        }
      }

      // 게시글 전체 조회(북마크 조회용)
      if (pathname === '/posts' && params.query.postIds) {
        try {
          let postIds = params.query.postIds;
          if (typeof postIds == 'string') {
            postIds = postIds.replace('[', '');
            postIds = postIds.replace(']', '');
            postIds = postIds.split(',');
          }

          const result = await Posts.findAll({ where: { postId: postIds }, raw: true });
          responseData = { bodies: result };
        } catch (err) {
          responseData = { code: 380 };
        }
      }

      // 게시글 전체 조회(리스트 출력용)
      if (pathname === '/posts' && params.params == 'list') {
        try {
          if (params.query.annualCategory) {
            const result = await Posts.count({
              where: { annualCategory: params.query.annualCategory },
            });
            responseData = { bodies: result };
          } else {
            const result = await Posts.count();
            responseData = { bodies: result };
          }
        } catch (err) {
          responseData = { code: 390 };
        }
      }

      // 연도별 게시글 조회
      if (pathname === '/posts' && params.query.annualCategory && !params.params) {
        try {
          const { annualCategory, pageNum } = params.query;
          const result = await Posts.findAll({
            where: { annualCategory },
            order: [['createdAt', 'DESC']],
            limit: 10,
            offset: (pageNum - 1) * 10,
            raw: true,
          });

          const userIds = result.map((post) => post.userId);

          await new Promise((resolve, reject) => {
            postModule.dataconnection(
              process.env.HOST,
              process.env.USERS_PORT,
              (data) => {
                postModule.nickname = data;
                resolve();
              },
              { userIds },
              null,
              null,
              null,
              'GET',
              '/users',
            );
          });

          const bodies = postModule.nickname.responseData.bodies;

          responseData = result.map((post) => {
            const nickname = bodies.filter((nickname) => nickname.userId == post.userId);
            return { ...post, nickname: nickname[0].nickname };
          });
        } catch (err) {
          responseData = { code: 330 };
        }
      }

      // 게시글 상세 조회
      if (pathname === '/posts' && params.query.postId) {
        try {
          const { postId } = params.query;
          const result = await Posts.findByPk(postId, { raw: true });

          if (!result) {
            responseData = { code: 342 };
          } else {
            await new Promise((resolve, reject) => {
              postModule.dataconnection(
                process.env.HOST,
                process.env.USERS_PORT,
                (data) => {
                  postModule.nickname = data;
                  resolve();
                },
                { userId: result.userId },
                null,
                null,
                null,
                'GET',
                '/users',
              );
            });

            result.nickname = postModule.nickname.responseData.bodies.nickname;

            await Posts.update({ viewCount: result.viewCount + 1 }, { where: { postId } });
            responseData = { result };
          }
        } catch (err) {
          responseData = { code: 340 };
        }
      }

      // 댓글 조회
      if (pathname === '/comments') {
        try {
          const { postId } = params.query;
          const findPostData = await Posts.findByPk(postId);

          if (!findPostData) {
            responseData = { code: 422 };
          } else {
            let result = await Comments.findAll({
              where: { postId },
              raw: true,
            });

            const userIds = result.map((comment) => comment.userId);

            await new Promise((resolve, reject) => {
              postModule.dataconnection(
                process.env.HOST,
                process.env.USERS_PORT,
                (data) => {
                  postModule.nickname = data;
                  resolve();
                },
                { userIds },
                null,
                null,
                null,
                'GET',
                '/users',
              );
            });

            const bodies = postModule.nickname.responseData.bodies;

            responseData = result.map((comment) => {
              const nickname = bodies.filter((nickname) => nickname.userId == comment.userId);
              return { ...comment, nickname: nickname[0].nickname };
            });
          }
        } catch (err) {
          responseData = { code: 420 };
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
      // 게시글 수정
      if (pathname === '/posts') {
        try {
          const { title, content, annualCategory, img } = params.bodies;
          const postId = params.params;

          if (!params.userId) {
            responseData = { code: 352 };
          } else if (!title) {
            responseData = { code: 353 };
          } else if (!content) {
            responseData = { code: 354 };
          } else if (!annualCategory) {
            responseData = { code: 355 };
          } else {
            const findPostData = await Posts.findByPk(postId);
            if (!findPostData) {
              responseData = { code: 356 };
            } else if (params.userId !== findPostData.userId) {
              responseData = { code: 357 };
            } else {
              await Posts.update({ title, content, annualCategory, img }, { where: { postId } });
              responseData = { code: 351 };
            }
          }
        } catch (err) {
          responseData = { code: 350 };
        }
      }

      // 댓글 수정
      if (pathname === '/comments') {
        try {
          const { postId, content } = params.bodies;
          const commentId = params.params;

          if (!params.userId) {
            responseData = { code: 432 };
          } else if (!content) {
            responseData = { code: 433 };
          } else {
            const findCommentData = await Comments.findByPk(commentId);
            if (!findCommentData) {
              responseData = { code: 434 };
            } else if (params.userId !== findCommentData.userId) {
              responseData = { code: 435 };
            } else {
              await Comments.update({ content }, { where: { postId, commentId } });
              responseData = { code: 431 };
            }
          }
        } catch (err) {
          responseData = { code: 430 };
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
      // 게시글 삭제
      if (pathname === '/posts' && params.params !== 'admin') {
        try {
          const postId = params.params;

          if (!params.userId) {
            responseData = { code: 362 };
          } else {
            const findPostData = await Posts.findByPk(postId);
            if (!findPostData) {
              responseData = { code: 363 };
            } else if (params.userId !== findPostData.userId && params.userId !== 1) {
              responseData = { code: 364 };
            } else {
              await Posts.destroy({ where: { postId } });
              responseData = { code: 361 };
            }
          }
        } catch (err) {
          console.log(err);
          responseData = { code: 360 };
        }
      }

      // 게시글 완전 삭제(게시글이 삭제된지 오래되었을 때 DB 데이터 삭제)
      if (pathname === '/posts' && params.params === 'admin') {
        try {
          if (!params.userId) {
            responseData = { code: 372 };
          } else if (params.userId !== 1) {
            responseData = { code: 372 };
          } else {
            const { contentId } = params.bodies;

            const findByImg = await Posts.findOne({
              where: { postId: contentId },
              attributes: ['img'],
              raw: true,
            });

            if (findByImg.img !== null) {
              const imgKey = findByImg.img.substring(findByImg.img.lastIndexOf('/') + 1);
              await imageDelete(imgKey);
            }
            const result = await Posts.destroy({ where: { postId: contentId }, force: true });
            responseData = { code: 371, result };
          }
        } catch (err) {
          responseData = { code: 370 };
        }
      }

      // 게시글 삭제 (회원 탈퇴 용)
      if (pathname === '/signout' && params.params == 'posts') {
        try {
          const { userId } = params;
          if (!userId) {
            responseData = { code: 382 };
          } else {
            await Posts.destroy({ where: { userId } });
            responseData = { code: 381 };
          }
        } catch (err) {
          responseData = { code: 380 };
        }
      }

      // 댓글 삭제
      if (pathname === '/comments' && params.params !== 'admin') {
        try {
          const commentId = params.params;

          if (!params.userId) {
            responseData = { code: 442 };
          } else {
            const findCommentData = await Comments.findByPk(commentId);
            if (!findCommentData) {
              responseData = { code: 443 };
            } else if (params.userId !== findCommentData.userId && params.userId !== 1) {
              responseData = { code: 444 };
            } else {
              await Comments.destroy({ where: { commentId } });
              responseData = { code: 441 };
            }
          }
        } catch (err) {
          console.log(err);
          responseData = { code: 440 };
        }
      }

      // 댓글 완전 삭제(삭제된 댓글이 오래되었을 때 DB 데이터 삭제)
      if (pathname === '/comments' && params.params === 'admin') {
        try {
          if (!params.userId) {
            responseData = { code: 452 };
          } else if (params.userId !== 1) {
            responseData = { code: 452 };
          } else {
            const { contentId } = params.bodies;

            const result = await Comments.destroy({ where: { commentId: contentId }, force: true });
            responseData = { code: 451, result };
          }
        } catch (err) {
          responseData = { code: 450 };
        }
      }

      // 댓글 삭제 (회원 탈퇴 용)
      if (pathname === '/signout' && params.params == 'comments') {
        try {
          const { userId } = params;

          if (!userId) {
            responseData = { code: 462 };
          } else {
            await Comments.destroy({ where: { userId } });
            responseData = { code: 461 };
          }
        } catch (err) {
          responseData = { code: 460 };
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
  }
};

function post(method, pathname, params, key, cb, responseData) {
  const response = {
    key,
    errorCode: 0,
    errormessage: 'success',
    responseData,
  };
  cb(response);
}

function get(method, pathname, params, key, cb, responseData) {
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
