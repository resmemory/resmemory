import Posts from './db/posts.db';
import Comments from './db/comments.db';

const onRequest = async (res, method, pathname, params, key, cb) => {
  let responseData = {};

  switch (method) {
    case 'POST':
      // 게시글 작성
      if (pathname === '/posts') {
        try {
          const { title, content, annualCategory, img } = params.bodies;

          if (!params.userId) {
            responseData = { code: 345 };
          } else if (!title) {
            responseData = { code: 342 };
          } else if (!content) {
            responseData = { code: 343 };
          } else if (!annualCategory) {
            responseData = { code: 344 };
          } else {
            await Posts.create({ title, content, annualCategory, img, userId: params.userId });
            responseData = { code: 341 };
          }
        } catch (err) {
          console.log(err);
          responseData = { code: 340 };
        }
      }

      // 댓글 작성
      if (pathname === '/comments') {
        try {
          const { content, postId } = params.bodies;
          const result = await Posts.findByPk(postId);

          if (!params.userId) {
            responseData = { code: 414 };
          } else if (!content) {
            responseData = { code: 412 };
          } else if (!result) {
            responseData = { code: 413 };
          } else {
            await Comments.create({ content, postId, userId: params.userId });
            responseData = { code: 411 };
          }
        } catch (err) {
          console.log(err);
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

export default onRequest;
