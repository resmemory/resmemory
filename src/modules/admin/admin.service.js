import reports from './report.service';
import adminModule from './admin.module';

const onRequest = async (res, method, pathname, params, key, cb) => {
  let responseData = {};
  switch (method) {
    case 'DELETE':
      if (pathname == '/admin/post') {
        try {
          const { reportType, contentId } = params.bodies;
          adminModule.connectToPosts(
            process.env.HOST,
            process.env.POSTS_PORT,
            (data) => {
              console.log('Posts Notification', `${reportType},${contentId}`);
            },
            contentId,
          );
          responseData = { code: 511 };
        } catch (error) {
          responseData = { code: 510 };
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