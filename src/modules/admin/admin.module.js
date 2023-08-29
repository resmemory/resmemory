import TcpServer from '../../classes/server';
import dotenv from 'dotenv';
import onRequest from './admin.service';
import TcpClient from '../../classes/client';
import { makePacket } from '../../utils/makePacket';

dotenv.config();

class AdminModule extends TcpServer {
  constructor() {
    // 부모 클래스 생성자 호출
    super('admin', process.env.ADMIN_PORT ? Number(process.env.ADMIN_PORT) : 3002, [
      'DELETE/admin',
      'POST/reports',
      'GET/reports',
      'PATCH/reports',
    ]);

    this.connectToDistributor(process.env.HOST, process.env.DIS_PORT, (data) => {
      console.log('Distributor Notification', data);
    });

    this.result;
  }

  // 클라이언트 요청에 따른 비즈니스 로직 호출
  async onRead(socket, data) {
    console.log(data);
    onRequest(socket, data.method, data.uri, data.params, data.key, (s, packet) => {
      socket.write(JSON.stringify(packet) + '¶');
    });
  }

  //admin/post 통신 Posts 접속 함수
  connectToPosts(host, port, onNoti, contentId) {
    // Posts 전달 패킷
    let params;
    params = this.context;
    params.params = 'admin';
    params.bodies = { contentId };
    const packet = makePacket('/posts', 'DELETE', 0, params);
    let isConnectedPosts = false;
    this.clientPosts = new TcpClient(
      host,
      port,
      (options) => {
        // Posts 접속 이벤트
        isConnectedPosts = true;
        this.clientPosts.write(packet);
      },
      // Posts 데이터 수신 이벤트
      (options, data) => {
        onNoti(data);
      },
      // Posts 접속 종료 이벤트
      (options) => {
        isConnectedPosts = false;
      },
      // Posts 통신 에러 이벤트
      (options) => {
        isConnectedPosts = false;
      },
    );

    // 주기적으로 재접속 시도
    const interval = setInterval(() => {
      if (isConnectedPosts !== true) {
        this.clientPosts.connect();
      } else {
        clearInterval(interval);
      }
    }, 1);
  }

  //admin/comment 통신 comment 접속 함수
  connectToComments(host, port, onNoti, contentId) {
    // Posts 전달 패킷
    let params;
    params = this.context;
    params.params = 'admin';
    params.bodies = { contentId };
    const packet = makePacket('/comments', 'DELETE', 0, params);
    let isConnectedComments = false;
    this.clientComments = new TcpClient(
      host,
      port,
      (options) => {
        // Posts 접속 이벤트
        isConnectedComments = true;
        this.clientComments.write(packet);
      },
      // Posts 데이터 수신 이벤트
      (options, data) => {
        onNoti(data);
      },
      // Posts 접속 종료 이벤트
      (options) => {
        isConnectedComments = false;
      },
      // Posts 통신 에러 이벤트
      (options) => {
        isConnectedComments = false;
      },
    );

    // 주기적으로 재접속 시도
    const interval = setInterval(() => {
      if (isConnectedComments !== true) {
        this.clientComments.connect();
      } else {
        clearInterval(interval);
      }
    }, 1);
  }
  //admin/thread 통신 comment 접속 함수
  connectToThreads(host, port, onNoti, contentId) {
    // Posts 전달 패킷
    let params;
    params = this.context;
    params.params = 'admin';
    params.bodies = { contentId };
    const packet = makePacket('/threads', 'DELETE', 0, params);
    let isConnectedThreads = false;
    this.clientThreads = new TcpClient(
      host,
      port,
      (options) => {
        // Posts 접속 이벤트
        isConnectedThreads = true;
        this.clientThreads.write(packet);
      },
      // Posts 데이터 수신 이벤트
      (options, data) => {
        onNoti(data);
      },
      // Posts 접속 종료 이벤트
      (options) => {
        isConnectedThreads = false;
      },
      // Posts 통신 에러 이벤트
      (options) => {
        isConnectedThreads = false;
      },
    );

    // 주기적으로 재접속 시도
    const interval = setInterval(() => {
      if (isConnectedThreads !== true) {
        this.clientThreads.connect();
      } else {
        clearInterval(interval);
      }
    }, 1);
  }
}

const adminModule = new AdminModule(); // 인스턴스 생성
export default adminModule;
