import TcpServer from '../../classes/server';
import dotenv from 'dotenv';
import onRequest from './users.service';
import relationship from './db/relationship';
import onMockRequest from './mock.users.service';

if (process.env.NODE_ENV == 'testpost') {
  dotenv.config({ path: '.env.testpost', override: true });
} else {
  dotenv.config();
}

class UsersModule extends TcpServer {
  map = {};
  constructor() {
    // 부모 클래스 생성자 호출
    relationship();
    super('users', process.env.USERS_PORT ? Number(process.env.USERS_PORT) : 9010, [
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

    this.connectToDistributor(process.env.HOST, process.env.DIS_PORT, (data) => {
      // Distributor 접속
      console.log('Distributor Notification', data);
    });

    this.posts;
  }

  // 클라이언트 요청에 따른 비즈니스 로직 호출
  onRead(socket, data) {
    if (data.mock == 'true') {
      onMockRequest(socket, data.method, data.uri, data.params, data.key, (s, packet) => {
        console.log(packet);
        socket.write(JSON.stringify(packet) + '¶');
      });
    } else {
      onRequest(socket, data.method, data.uri, data.params, data.key, (s, packet) => {
        console.log(packet);
        socket.write(JSON.stringify(packet) + '¶');
      });
    }
  }
}
const usersmodule = new UsersModule(); // 인스턴스 생성
export default usersmodule;
