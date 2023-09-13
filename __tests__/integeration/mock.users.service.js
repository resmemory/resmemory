import Users from './db/users.db';

const onRequest = async (res, method, pathname, params, key, cb) => {
  let token;
  let responseData = {};
  const query = params.query;

  // POST
  switch (method) {
    // GET
    case 'GET':
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

export default onRequest;
