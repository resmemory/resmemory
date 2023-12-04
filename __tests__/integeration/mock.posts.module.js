import TcpServer from '../../src/classes/server.js';
import dotenv from 'dotenv';
import onRequest from '../../src/modules/posts/posts.service.js';
import relationship from '../../src/modules/posts/db/relationship';

dotenv.config();

class MockPostsModule extends TcpServer {
  constructor() {
    // 부모 클래스 생성자 호출
    relationship();
    super('posts', process.env.MOCK_POSTS_PORT ? Number(process.env.MOCK_POSTS_PORT) : 3011, [
      'POST/posts',
      'GET/posts',
      'PATCH/posts',
      'DELETE/posts',
      'POST/comments',
      'GET/comments',
      'PATCH/comments',
      'DELETE/comments',
      'DELETE/signout',
    ]);

    this.nickname;
    this.dataconnection;
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

const mockPostModule = new MockPostsModule();
export default mockPostModule;
