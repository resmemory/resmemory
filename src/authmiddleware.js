import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function authmiddleware(req, res, params) {
  let user;

  const { authorization } = req.headers;
  const [authType, authToken] = (authorization ?? '').split(' ');
  if (authType !== 'Bearer' || !authToken.length) {
    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ respondData: { code: 0 } }));
    return;
  }
  const verified = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
  user = Number(verified.user.userId);
  return user;
}

export default authmiddleware;
