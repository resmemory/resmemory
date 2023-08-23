import TcpServer from '../../classes/server';
import dotenv from 'dotenv';
import onRequest from './admin.service';
import Report from './db/reports.db';
import jwt from 'jsonwebtoken';

dotenv.config();

class AdminModule extends TcpServer {
  constructor() {
    // 부모 클래스 생성자 호출
    super('admin', process.env.ADMIN_PORT ? Number(process.env.ADMIN_PORT) : 3002, [
      'DELETE/admin/post',
      'DELETE/admin/comment',
      'DELETE/admin/thread',
      'POST/reports',
      'GET/reports',
    ]);
    this.connectToDistributor(process.env.HOST, process.env.DIS_PORT, (data) => {
      // Distributor 접속
      console.log('Distributor Notification', data);
    });
  }

  // 클라이언트 요청에 따른 비즈니스 로직 호출
  async onRead(socket, data) {
    console.log(data);

    const key = socket.remoteAddress + ':' + socket.remotePort;
    console.log('onRead', socket.remoteAddress, socket.remotePort, data);

    let token;
    let responseData;
    const query = data.params;
    let pageNum = 1;

    if (data.method == 'DELETE' && data.uri == '/admin/post') {
      const { postId } = data.params;
      responseData = await Report.destroy({ where: { postId } })
    } 

    if (data.method == 'DELETE' && data.uri == '/admin/comment') {
      const { commentId } = data.params;
      responseData = await Report.destroy({ where: { commentId } })
    } 

    
    if (data.method == 'DELETE' && data.uri == '/admin/thread') {
      const { threadId } = data.params;
      responseData = await Report.destroy({ where: { threadId } })
    } 
 
    if (data.method == 'POST' && data.uri == '/users') {
      const { email, nickname, password, googleId, memoryPoint, profileimage } = data.params;

      responseData = await Users.create({
        email,
        nickname,
        password,
        googleId,
        memoryPoint,
        profileimage,
      });
    }
    if (data.method == 'PATCH' && data.uri == '/users') {
      const { nickname, profileimage } = data.params;
      const userId = query.params;
      responseData = await Users.update(
        {
          nickname,
          profileimage,
        },
        { where: { userId } },
      );
    }
    if (data.method == 'DELETE' && data.uri == '/users') {
      const userId = query.params;
      responseData = await Users.destroy({ where: { userId } });
    }
    if (data.method == 'POST' && data.uri == '/users/login') {
      const { email, password } = data.params;

      const user = await Users.findOne({ where: { email, password } });
      token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
      });
    }
    onRequest(
      socket,
      data.method,
      data.uri,
      data.params,
      data.key,
      async (s, packet) => {
        packet.token = token;
        socket.write(JSON.stringify(packet) + '¶');
      },
      responseData,
    );
  }
}

const adminModule = new AdminModule(); // 인스턴스 생성

