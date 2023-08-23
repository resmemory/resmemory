/**
 * 상품 관리의 각 기능별로 분기
 */
const onRequest = (res, method, pathname, params, key, cb, responseData) => {
  switch (method) {
    case 'GET':
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
