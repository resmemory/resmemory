import net from 'net';
import TcpClient from './client';
import { makePacket } from '../utils/makePacket';

class TcpServer {
  nickname = {};
  constructor(name, port, urls) {
    //서버 상태 정보
    this.context = {
      port: port,
      name: name,
      urls: urls,
    };
    this.merge = {};

    // 서버 객체 생성
    this.server = net.createServer((socket) => {
      // 클라이언트 접속 이벤트
      this.onCreate(socket);

      // 에러 이벤트
      socket.on('error', (exception) => {
        this.onClose(socket);
      });

      // 클라이언트 접속 종료 이벤트
      socket.on('close', () => {
        this.onClose(socket);
      });

      // 데이터 수신 이벤트
      socket.on('data', (data) => {
        let key = socket.remoteAddress + ':' + socket.remotePort;
        let sz = this.merge[key] ? this.merge[key] + data.toString() : data.toString();
        let arr = sz.split('¶');

        for (let n in arr) {
          if (sz.charAt(sz.length - 1) !== '¶' && n === arr.length - 1) {
            this.merge[key] = arr[n];
            break;
          } else if (arr[n] === '') {
            break;
          } else {
            this.onRead(socket, JSON.parse(arr[n]));
          }
        }
      });
    });

    // 서버 객체 에러 이벤트
    this.server.on('error', (err) => {
      console.log(err);
    });

    // 리슨
    this.server.listen(port, () => {
      console.log('listen', this.server.address());
    });
  }

  onCreate(socket) {
    console.log('onCreate', socket.remoteAddress, socket.remotePort);
  }

  onClose(socket) {
    console.log('onClose', socket.remoteAddress, socket.remotePort);
  }

  // Distributor 접속 함수
  connectToDistributor(host, port, onNoti) {
    // Distributor 전달 패킷
    const packet = makePacket('/distributes', 'POST', 0, this.context);
    let isConnectedDistributor = false;

    this.clientDistributor = new TcpClient(
      host,
      port,
      (options) => {
        // Distributor 접속 이벤트
        isConnectedDistributor = true;
        this.clientDistributor.write(packet);
      },
      // Distributor 데이터 수신 이벤트
      (options, data) => {
        onNoti(data);
      },
      // Distributor 접속 종료 이벤트
      (options) => {
        isConnectedDistributor = false;
      },
      // Distributor 통신 에러 이벤트
      (options) => {
        isConnectedDistributor = false;
      },
    );

    // 주기적으로 재접속 시도
    setInterval(() => {
      if (isConnectedDistributor !== true) {
        this.clientDistributor.connect();
      }
    }, 3000);
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
    setInterval(() => {
      if (isConnectedUsers !== true) {
        this.clientUsers.connect();
      }
    }, 3000);
  }

  // getPosts 접속 함수
  connectToGetPosts(host, port, onNoti, userId) {
    // getPosts 전달 패킷
    let params;
    params = this.context;
    params.query = { userId };
    const packet = makePacket('/posts', 'GET', 0, params);
    let isConnectedGetPosts = false;
    this.clientGetPosts = new TcpClient(
      host,
      port,
      (options) => {
        // Users 접속 이벤트
        isConnectedGetPosts = true;
        this.clientGetPosts.write(packet);
      },
      // Users 데이터 수신 이벤트
      (options, data) => {
        onNoti(data);
      },
      // Users 접속 종료 이벤트
      (options) => {
        isConnectedGetPosts = false;
      },
      // Users 통신 에러 이벤트
      (options) => {
        isConnectedGetPosts = false;
      },
    );

    // 주기적으로 재접속 시도
    setInterval(() => {
      if (isConnectedGetPosts !== true) {
        this.clientGetPosts.connect();
      }
    }, 3000);
  }
}

export default TcpServer;
