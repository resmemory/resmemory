import TcpServer from '../classes/server';
import { makePacket } from '../utils/makePacket.js';
import dotenv from 'dotenv';
dotenv.config();

// 접속 노드 관리 오브젝트
// Server 클래스 상속
class distributor extends TcpServer {
  map = {};

  constructor() {
    super('distributor', process.env.DIS_PORT, ['POST/distributes', 'GET/distributes']);
  }

  // 노드 접속 이벤트 처리
  onCreate(socket) {
    console.log('onCreate', socket.remoteAddress, socket.remotePort);
    this.sendInfo(socket);
  }

  // 노드 접속 해제 이벤트 처리
  onClose(socket) {
    const key = socket.remoteAddress + ':' + socket.remotePort;
    console.log('onClose', socket.remoteAddress, socket.remotePort);
    delete this.map[key];
    this.sendInfo();
  }

  // 노드 등록 처리
  onRead(socket, json) {
    const key = socket.remoteAddress + ':' + socket.remotePort;
    console.log('onRead', socket.remoteAddress, socket.remotePort, json);

    if (json.uri === '/distributes' && json.method === 'POST') {
      this.map[key] = {
        socket: socket,
      };
      this.map[key].info = json.params;
      this.map[key].info.host = socket.remoteAddress;
      this.sendInfo();
    }
  }

  // 패킷 전송
  write(socket, packet) {
    socket.write(JSON.stringify(packet) + '¶');
  }

  // 접속 노드 혹은 특정 소켓에 접속 노드 정보 전파
  sendInfo(socket) {
    const packet = makePacket('/distributes', 'GET', 0, []);

    for (let n in this.map) {
      packet.params.push(this.map[n].info);
    }

    if (socket) {
      this.write(socket, packet);
    } else {
      for (let n in this.map) {
        this.write(this.map[n].socket, packet);
      }
    }
  }
}

// distributor 객체 생성
new distributor();
