import TcpServer from '../../src/classes/server.js';
import dotenv from 'dotenv';
import onRequest from '../../src/modules/threads/threads.service.js';

dotenv.config();

class ThreadsModule extends TcpServer {
  constructor() {
    // 부모 클래스 생성자 호출
    super('threads', process.env.MOCK_THREADS_PORT ? Number(process.env.MOCK_THREADS_PORT) : 3013, [
      // 스레드 조회
      'GET/threads',

      // 스레드 작성
      'POST/threads',

      // 스레드 삭제
      'DELETE/threads',

      // 스레드 완전 삭제
      'DELETE/threads/admin',
    ]);
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

const mockThreadsModule = new ThreadsModule(); // 인스턴스 생성
export default mockThreadsModule;
