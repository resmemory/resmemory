import TcpServer from '../../classes/server';
import dotenv from 'dotenv';
import onRequest from './posts.service';
import TcpClient from '../../classes/client';
import { makePacket } from '../../utils/makePacket';
dotenv.config();

class PostsModule extends TcpServer {
  constructor() {
    // 부모 클래스 생성자 호출

    super('posts', process.env.POSTS_PORT ? Number(process.env.POSTS_PORT) : 3001, [
      'POST/posts',
      'GET/posts',
      'PATCH/posts',
      'DELETE/posts',
      'POST/comments',
      'GET/comments',
      'PATCH/comments',
      'DELETE/comments',
    ]);
    this.connectToDistributor(process.env.HOST, process.env.DIS_PORT, (data) => {
      console.log('Users Notification', data);
    });

    this.nickname;
  }

  // 클라이언트 요청에 따른 비즈니스 로직 호출
  onRead(socket, data) {
    console.log('onRead', socket.remoteAddress, socket.remotePort, data);
    onRequest(socket, data.method, data.uri, data.params, data.key, (s, packet) => {
      console.log(packet);
      socket.write(JSON.stringify(packet) + '¶');
    });
  }

  // Users 접속 함수
  connectToUsers(host, port, onNoti, userId) {
    // Users 전달 패킷
    let params;
    params = this.context;
    params.query = { userId };
    const packet = makePacket('/users', 'GET', 0, params);
    let isConnectedUsers = false;
    this.clientUsers = new TcpClient(
      host,
      port,
      (options) => {
        // Users 접속 이벤트
        isConnectedUsers = true;
        this.clientUsers.write(packet);
      },
      // Users 데이터 수신 이벤트
      (options, data) => {
        onNoti(data);
      },
      // Users 접속 종료 이벤트
      (options) => {
        isConnectedUsers = false;
      },
      // Users 통신 에러 이벤트
      (options) => {
        isConnectedUsers = false;
      },
    );

    // 주기적으로 재접속 시도
    const interval = setInterval(() => {
      if (isConnectedUsers !== true) {
        this.clientUsers.connect();
      } else {
        clearInterval(interval);
      }
    }, 1);
  }

  // AllUsers 접속 함수
  connectToAllUsers(host, port, onNoti, userId) {
    // AllUsers 전달 패킷
    let params;
    params = this.context;

    if (Array.isArray(userId)) {
      params.query = { userIds: userId };
    } else {
      params.query = { userId };
    }
    const packet = makePacket('/users', 'GET', 0, params);
    let isConnectedAllUsers = false;
    this.clientAllUsers = new TcpClient(
      host,
      port,
      (options) => {
        // AllUsers 접속 이벤트
        isConnectedAllUsers = true;
        this.clientAllUsers.write(packet);
      },
      // AllUsers 데이터 수신 이벤트
      (options, data) => {
        onNoti(data);
      },
      // AllUsers 접속 종료 이벤트
      (options) => {
        isConnectedAllUsers = false;
      },
      // AllUsers 통신 에러 이벤트
      (options) => {
        isConnectedAllUsers = false;
      },
    );

    // 주기적으로 재접속 시도
    const interval = setInterval(() => {
      if (isConnectedAllUsers !== true) {
        this.clientAllUsers.connect();
      } else {
        clearInterval(interval);
      }
    }, 1);
  }
}

const postModule = new PostsModule();
export default postModule;
