import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function authmiddleware(req, res, params) {
  let user;

  const { authorization } = req.headers;
  const [authType, authToken] = (authorization ?? '').split(' ');
  if (!authorization) {
    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ responseData: { code: 0 } }));
    return;
  }
  if (authType !== 'Bearer' || !authToken.length) {
    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ responseData: { code: 0 } }));
    return;
  }
  const today = Date.now();
  if (today - jwt.decode(authToken).exp * 1000 > 0) {
    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ responseData: { code: 0 } }));
    return;
  } else {
    const verified = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
    user = Number(verified.user.userId);
  }
  return user;
}

export default authmiddleware;
