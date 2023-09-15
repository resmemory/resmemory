import WebSocket from 'ws';
import { ChatMessage, ChatLog, getTimes } from './db/mongoose';

export default class ChatServer {
  constructor(port, onMessage) {
    this.port = port;
    this.onMessage = onMessage;
    this.clients = new Set(); // 연결된 클라이언트를 추적하기 위한 Set

    this.server = new WebSocket.Server({ port });

    this.server.on('connection', async (socket, request) => {
      const nickname = request.url.split('?')[1].split('=')[1];
      if (nickname !== undefined) {
        const chatLog = new ChatLog({
          nickname: nickname,
        });
        await chatLog.save();
      }
      this.clients.add(socket); // 클라이언트 추가

      console.log('Client connected:', socket._socket.remoteAddress, socket._socket.remotePort);
      const arrMessage = await getTimes(nickname);
      for (const messageData of arrMessage) {
        socket.send(JSON.stringify(messageData));
      }
      socket.on('message', async (message) => {
        try {
          const stringMessage = message.toString();

          console.log('Server Received:', stringMessage);

          // 채팅 메시지를 MongoDB에 저장
          const chatMessage = new ChatMessage({
            message: stringMessage,
            timestamp: Date.now(), // Date.now()를 사용하여 현재 시간을 저장
          });
          await chatMessage.save(); // await를 사용하여 저장 작업을 기다림
          console.log('채팅 메시지가 성공적으로 저장되었습니다.');
          this.onMessage(socket, stringMessage);
        } catch (err) {
          console.error('채팅 메시지 저장 오류:', err);
        }
      });

      socket.on('close', async () => {
        console.log(
          'Client disconnected:',
          socket._socket.remoteAddress,
          socket._socket.remotePort,
        );

        this.clients.delete(socket); // 클라이언트 제거
      });

      socket.on('error', (err) => {
        console.error('Client error:', err);
      });
    });
  }
  broadcastMessage(message) {
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
