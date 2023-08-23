import Posts from './db/posts.db';

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
