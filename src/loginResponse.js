import frontconnection from './frontconnection';

function loginResponse(res, packet) {
  if (packet.responseData.code == 121) {
    res.setHeader('Authorization', `Bearer ${packet.responseData.token}`);
    delete packet.token;
    res.end(JSON.stringify(packet));
  } else if (packet.responseData.code == 111) {
    const today = new Date();

    res.setHeader('Set-Cookie', [`refresh=${packet.responseData.refresh}; expires=7d`]);
    res.end(JSON.stringify(packet));
    delete packet.responseData.refresh;
  } else if (packet.responseData.code == 123) {
    res.setHeader('Authorization', `Bearer ${packet.responseData.token}`);
    delete packet.responseData.refresh;
    delete packet.token;
    res.end(JSON.stringify(packet));
  } else if (packet.responseData.code == 131 || packet.responseData.code == 141) {
    res.removeHeader('Set-Cookie');
    res.removeHeader('Authorization');
    res.end(JSON.stringify(packet));
  } else if (packet.responseData.code == 1211) {
    frontconnection('/oauth', res, packet.responseData.kakaocode);
  }
}

export default loginResponse;
