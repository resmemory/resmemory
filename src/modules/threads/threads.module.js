import TcpServer from '../../classes/server';
import dotenv from 'dotenv';
import onRequest from './threads.service';

dotenv.config();

class ThreadsModule extends TcpServer {
  constructor() {
    // 부모 클래스 생성자 호출
    super('threads', process.env.THREADS_PORT ? Number(process.env.THREADS_PORT) : 9010, [
      'GET/threads',
      'POST/threads',
      'PATCH/threads',
      'DELETE/threads',
    ]);

    this.connectToDistributor(process.env.HOST, process.env.DIS_PORT, (data) => {
      // Distributor 접속
      console.log('Distributor Notification', data);
    });
  }

  // 클라이언트 요청에 따른 비즈니스 로직 호출
  onRead(socket, data) {
    console.log('onRead', socket.remoteAddress, socket.remotePort, data);

    if (data.method === 'GET' && data.uri === '/threads') {
      // 'GET/threads' 요청 처리
      onRequest(socket, data.method, data.uri, data.params, data.key, (s, packet) => {
        console.log(packet);
        socket.write(JSON.stringify(packet) + '¶');
      });
    } else if (data.method === 'POST' && data.uri === '/threads') {
      // 'POST/threads' 요청 처리
      onRequest(socket, data.method, data.uri, data.params, data.key, (s, packet) => {
        console.log(packet);
        socket.write(JSON.stringify(packet) + '¶');
      });
    } else if (data.method === 'PATCH' && data.uri === '/threads') {
      // 'PATCH/threads' 요청 처리
      onRequest(socket, data.method, data.uri, data.params, data.key, (s, packet) => {
        console.log(packet);
        socket.write(JSON.stringify(packet) + '¶');
      });
    } else if (data.method === 'DELETE' && data.uri === '/threads') {
      // 'DELETE/threads' 요청 처리
      onRequest(socket, data.method, data.uri, data.params, data.key, (s, packet) => {
        console.log(packet);
        socket.write(JSON.stringify(packet) + '¶');
      });
    } else {
      console.log('Invalid request:', data.method, data.uri);
      socket.write('Invalid request¶');
    }
  }
}

new ThreadsModule(); // 인스턴스 생성
