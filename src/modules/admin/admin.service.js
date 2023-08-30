import reports from './report.service';
import adminModule from './admin.module';

const onRequest = async (res, method, pathname, params, key, cb) => {
  let responseData = {};
  switch (method) {
    case 'DELETE':
      if (params.params == 'post') {
        try {
          const { contentId } = params.bodies;
          await new Promise((resolve, reject) => {
            dataconnection(
              process.env.HOST,
              process.env.POSTS_PORT,
              (data) => {
                adminModule.result = data;
                resolve();
              },
              { contentId },
              null,
              null,
              null,
              'DELETE',
              '/posts',
            );
          });
          const resultNum = adminModule.result;

          if (!resultNum) {
            responseData = { code: 512 };
          } else {
            //updateone
            responseData = { code: 511 };
          }
        } catch (error) {
          responseData = { code: 510 };
        }
      }
      if (params.params == 'comment') {
        try {
          const { contentId } = params.bodies;
          await new Promise((resolve, reject) => {
            dataconnection(
              process.env.HOST,
              process.env.POSTS_PORT,
              (data) => {
                adminModule.result = data;
                resolve();
              },
              { contentId },
              null,
              null,
              null,
              'DELETE',
              '/comments',
            );
          });

          const resultNum = adminModule.result;

          if (!resultNum) {
            responseData = { code: 522 };
          } else {
            responseData = { code: 521 };
          }
        } catch (error) {
          responseData = { code: 520 };
        }
      }
      if (params.params == 'thread') {
        try {
          const { contentId } = params.bodies;
          await new Promise((resolve, reject) => {
            dataconnection(
              process.env.HOST,
              process.env.POSTS_PORT,
              (data) => {
                adminModule.result = data;
                resolve();
              },
              { contentId },
              null,
              null,
              null,
              'DELETE',
              '/threads',
            );
          });

          const resultNum = adminModule.result;

          if (!resultNum) {
            responseData = { code: 532 };
          } else {
            responseData = { code: 531 };
          }
        } catch (error) {
          responseData = { code: 530 };
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
    case 'GET':
      if (pathname == '/reports') {
        responseData = await reports(method, params, responseData);
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
    case 'POST':
      if (pathname == '/reports') {
        responseData = await reports(method, params, responseData);
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
    case 'PATCH':
      if (pathname == '/reports') {
        responseData = await reports(method, params, responseData);
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
