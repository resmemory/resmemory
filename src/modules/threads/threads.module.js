import TcpServer from '../../classes/server';
import dotenv from 'dotenv';
import onRequest from './threads.service';

dotenv.config();

class ThreadsModule extends TcpServer {
  constructor() {
    // 부모 클래스 생성자 호출
    super('threads', process.env.THREADS_PORT ? Number(process.env.THREADS_PORT) : 9010, [
      // 스레드 조회
      'GET/threads',

      // 스레드 작성
      'POST/threads',

      // 스레드 삭제
      'DELETE/threads',

      // 스레드 완전 삭제
      'DELETE/threads/admin',
    ]);

    this.connectToDistributor(process.env.HOST, process.env.DIS_PORT, (data) => {
      // Distributor 접속
      console.log('Distributor Notification', data);
    });
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

new ThreadsModule(); // 인스턴스 생성
