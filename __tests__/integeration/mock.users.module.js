import TcpServer from '../../src/classes/server.js';
import dotenv from 'dotenv';
import onRequest from '../../src/modules/users/users.service.js';
import relationship from '../../src/modules/users/db/relationship.js';
dotenv.config();

class MockUsersModule extends TcpServer {
  map = {};
  constructor() {
    // 부모 클래스 생성자 호출
    relationship();
    super('users', process.env.MOCK_USERS_PORT ? Number(process.env.MOCK_USERS_PORT) : 9011, [
      'POST/mail',
      'POST/verified',
      'POST/signup',
      'POST/login',
      'POST/logout',
      'GET/users',
      'PATCH/users',
      'DELETE/users',
      'POST/bookmarks',
      'DELETE/bookmarks',
      'GET/bookmarks',
      'POST/oauth',
      'GET/oauth',
      'POST/kakaoLogin',
    ]);

    this.posts;
  }

  // 클라이언트 요청에 따른 비즈니스 로직 호출
  onRead(socket, data) {
    console.log('onRead', socket.remoteAddress, socket.remotePort, data);
    onRequest(socket, data.method, data.uri, data.params, data.key, (s, packet) => {
      console.log(packet);
      socket.write(JSON.stringify(packet) + '¶');
    });
  }
}
const mockUsersModule = new MockUsersModule();
export default mockUsersModule;
