import { makePacket } from '../utils/makePacket';
import TcpClient from '../classes/client';
function dataconnection(host, port, onNoti, query, params, bodies, userId, method, uri) {
  // getPosts 전달 패킷
  const context = {
    port,
    name: 'connection',
    urls: ['GET/posts', 'GET/users', 'DELETE/signout'],
    query,
    params,
    bodies,
    userId,
  };

  const packet = makePacket(uri, method, 0, context);
  let isConnectedData = false;
  const clientData = new TcpClient(
    host,
    port,
    (options) => {
      // getPosts 접속 이벤트
      isConnectedData = true;
      clientData.write(packet);
    },
    // getPosts 데이터 수신 이벤트
    (options, data) => {
      onNoti(data);
    },
    // getPosts 접속 종료 이벤트
    (options) => {
      isConnectedData = false;
    },
    // getPosts 통신 에러 이벤트
    (options) => {
      isConnectedData = false;
    },
  );
  const interval = setInterval(() => {
    if (isConnectedData !== true) {
      clientData.connect();
    } else {
      clearInterval(interval);
    }
  }, 1);
}

export default dataconnection;
