import Reports from './db/reports.db';
import reports from './report.service';
import adminModule from './admin.module';
import dataconnection from '../connection';
const onRequest = async (res, method, pathname, params, key, cb) => {
  let responseData = {};
  switch (method) {
    case 'DELETE':
      if (params.params == 'post') {
        try {
          const { reportId, contentId } = params.bodies;
          const { userId } = params;
          await new Promise((resolve, reject) => {
            dataconnection(
              process.env.HOST,
              process.env.POSTS_PORT,
              (data) => {
                adminModule.result = data;
                resolve();
              },
              null,
              contentId,
              null,
              userId,
              'DELETE',
              '/posts',
            );
          });
          const resultNum = adminModule.result;

          const report = await Reports.findOne({ where: { reportId } });
          if (!report) {
            responseData = { code: 512 };
          } else if (report.dataValues.isReport == 'true') {
            responseData = { code: 513 };
          } else if (resultNum.responseData.code == 363) {
            await Reports.update({ isReport: '2' }, { where: { reportId } });
            responseData = { code: 514 };
          } else if (resultNum.responseData.code !== 361) {
            responseData = { code: 515 };
          } else {
            await Reports.update({ isReport: 'true' }, { where: { reportId } });
            responseData = { code: 511 };
          }
        } catch (error) {
          console.log(error);
          responseData = { code: 510 };
        }
      }

      if (params.params == 'comment') {
        try {
          const { reportId, contentId } = params.bodies;
          const { userId } = params;
          await new Promise((resolve, reject) => {
            dataconnection(
              process.env.HOST,
              process.env.POSTS_PORT,
              (data) => {
                adminModule.result = data;
                resolve();
              },
              null,
              contentId,
              null,
              userId,
              'DELETE',
              '/comments',
            );
          });

          const resultNum = adminModule.result;

          const report = await Reports.findOne({ where: { reportId } });
          if (!report) {
            responseData = { code: 522 };
          } else if (report.dataValues.isReport == 'true') {
            responseData = { code: 523 };
          } else if (resultNum.responseData.code == 443) {
            await Reports.update({ isReport: '2' }, { where: { reportId } });
            responseData = { code: 524 };
          } else if (resultNum.responseData.code !== 441) {
            responseData = { code: 525 };
          } else {
            await Reports.update({ isReport: 'true' }, { where: { reportId } });
            responseData = { code: 521 };
          }
        } catch (error) {
          console.log(error);
          responseData = { code: 520 };
        }
      }
      if (params.params == 'thread') {
        try {
          const { reportId, contentId } = params.bodies;
          const { userId } = params;
          await new Promise((resolve, reject) => {
            dataconnection(
              process.env.HOST,
              process.env.THREADS_PORT,
              (data) => {
                adminModule.result = data;
                resolve();
              },
              null,
              contentId,
              null,
              userId,
              'DELETE',
              '/threads',
            );
          });

          const resultNum = adminModule.result;

          const report = await Reports.findOne({ where: { reportId } });
          if (!report) {
            responseData = { code: 532 };
          } else if (report.dataValues.isReport == 'true') {
            responseData = { code: 533 };
          } else if (resultNum.responseData.code == 735) {
            await Reports.update({ isReport: '2' }, { where: { reportId } });
            responseData = { code: 534 };
          } else if (resultNum.responseData.code !== 731) {
            responseData = { code: 535 };
          } else {
            await Reports.update({ isReport: 'true' }, { where: { reportId } });
            responseData = { code: 531 };
          }
        } catch (error) {
          console.log(error);
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
