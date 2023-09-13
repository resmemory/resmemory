const onMockRequest = async (res, method, pathname, params, key, cb) => {
  let responseData = {};
  const query = params.query;
  switch (method) {
    // GET
    case 'GET':
      // 회원 조회 (게시글 상세 조회용)
      if (pathname == '/users' && query.userId && !query.userIds) {
        try {
          responseData = { bodies: { userId: 1, nickname: '테스트' }, code: 1711 };
        } catch (err) {
          responseData = { code: 1701, bodies: null };
        }
      }

      // 회원 조회 (게시글 전체 조회, 댓글 조회용)
      if (pathname == '/users' && !query.userId && query.userIds) {
        try {
          responseData = { bodies: [{ userId: 1, nickname: '테스트' }], code: 1712 };
        } catch (err) {
          responseData = { code: 1702, bodies: null };
        }
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

export default onMockRequest;
