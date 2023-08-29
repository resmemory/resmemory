import TcpServer from '../../classes/server';
import dotenv from 'dotenv';
import onRequest from './users.service';
import relationship from './db/relationship';
import { makePacket } from '../../utils/makePacket';
import TcpClient from '../../classes/client';
dotenv.config();

class UsersModule extends TcpServer {
  map = {};
  constructor() {
    // 부모 클래스 생성자 호출
    let userId;
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
    ]);
    this.connectToDistributor(process.env.HOST, process.env.DIS_PORT, (data) => {
      // Distributor 접속
      console.log('Distributor Notification', data);
    });
    this.connectToGetPosts(
      process.env.HOST,
      process.env.DIS_PORT,
      (data) => {
        console.log('GET Posts Notification', data);
      },
      userId,
    );
    this.posts;
  }

  // getPosts 접속 함수
  connectToGetPosts(host, port, onNoti, postIds) {
    // getPosts 전달 패킷
    let params;
    params = this.context;
    params.query = { postIds };
    const packet = makePacket('/posts', 'GET', 0, params);
    let isConnectedGetPosts = false;
    this.clientGetPosts = new TcpClient(
      host,
      port,
      (options) => {
        // getPosts 접속 이벤트
        isConnectedGetPosts = true;
        this.clientGetPosts.write(packet);
      },
      // getPosts 데이터 수신 이벤트
      (options, data) => {
        onNoti(data);
      },
      // getPosts 접속 종료 이벤트
      (options) => {
        isConnectedGetPosts = false;
      },
      // getPosts 통신 에러 이벤트
      (options) => {
        isConnectedGetPosts = false;
      },
    );

    // 주기적으로 재접속 시도
    const interval = setInterval(() => {
      if (isConnectedGetPosts !== true) {
        this.clientGetPosts.connect();
      } else {
        clearInterval(interval);
      }
    }, 1);
  }

  connectToRemovePosts(host, port, onNoti, userId) {
    let params;
    params = this.context;
    params.params = 'posts';
    params.userId = userId;
    const packet = makePacket('/signout', 'DELETE', 0, params);
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

  connectToRemoveComments(host, port, onNoti, userId) {
    // Posts 전달 패킷
    let params;
    params = this.context;
    params.params = 'comments';
    params.userId = userId;
    const packet = makePacket('/signout', 'DELETE', 0, params);
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

  // 클라이언트 요청에 따른 비즈니스 로직 호출
  onRead(socket, data) {
    console.log('onRead', socket.remoteAddress, socket.remotePort, data);
    onRequest(socket, data.method, data.uri, data.params, data.key, (s, packet) => {
      console.log(packet);
      socket.write(JSON.stringify(packet) + '¶');
    });
  }
}
const usersmodule = new UsersModule(); // 인스턴스 생성
export default usersmodule;
