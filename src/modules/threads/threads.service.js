import Threads from './db/threads.db';
import { Op } from 'sequelize';

const onRequest = async (res, method, pathname, params, key, cb) => {
  let responseData = {};

  switch (method) {
    // 스레드 조회 함수
    case 'GET':
      if (pathname === '/threads') {
        try {
          const today = new Date();
          let yesterday = Date.now(today) - 86400000;
          yesterday = new Date(yesterday);

          const result = await Threads.findAll({
            where: { createdAt: { [Op.between]: [yesterday, today] } },
            order: [['createdAt', 'DESC']],
          });
          if (result) {
            responseData = { result };
          } else {
            responseData = { code: 711 };
          }
        } catch (error) {
          responseData = { code: 713 };
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
      }

    // 스레드 생성 함수
    case 'POST':
      if (pathname === '/threads') {
        try {
          const { userId } = params;
          const { content } = params.bodies;
          if (!userId) {
            responseData = { code: 0 };
          } else if (content) {
            await Threads.create({ userId, content });
            responseData = { code: 721 };
          } else {
            responseData = { code: 722 };
          }
        } catch (error) {
          responseData = { code: 720, error };
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

    // 스레드 삭제 함수
    case 'DELETE':
      if (pathname == '/threads' && params.params !== 'admin') {
        try {
          const { userId } = params;
          const threadId = params.params;
          const threadData = await Threads.findByPk(threadId);
          if (!userId) {
            responseData = { code: 0 };
          } else if (!threadData) {
            responseData = { code: 735 };
          } else if (userId == threadData.userId) {
            if (threadId) {
              const result = await Threads.destroy({ where: { threadId } });
              if (result) {
                responseData = { code: 731 };
              } else {
                responseData = { code: 732 };
              }
            } else {
              responseData = { code: 733 };
            }
          } else {
            responseData = { code: 734 };
          }
        } catch (error) {
          responseData = { code: 730 };
          console.log(error);
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

      // 스레드 완전 삭제 함수
      if (pathname == '/threads' && params.params == 'admin') {
        try {
          if (!params.userId) {
            responseData = { code: 372 };
          } else if (params.userId !== 1) {
            responseData = { code: 372 };
          } else {
            const { contentId } = params.bodies;

            const result = await Threads.destroy({
              where: { threadId: contentId },
              force: true,
            });
            responseData = { code: 371, result };
          }
        } catch (err) {
          responseData = { code: 370, err };
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
