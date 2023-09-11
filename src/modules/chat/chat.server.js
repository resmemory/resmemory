import WebSocket from 'ws';
import { ChatMessage, ChatOpenLog, ChatCloseLog, getTimes } from './db/mongoose';

export default class ChatServer {
  constructor(port, onMessage) {
    this.port = port;
    this.onMessage = onMessage;

    this.server = new WebSocket.Server({ port });

    this.server.on('connection', async (socket, request) => {
      const nickname = request.url.split('?')[1].split('=')[1];
      if (nickname !== undefined) {
        const chatOpenLog = new ChatOpenLog({
          nickname: nickname,
        });
        await chatOpenLog.save();
      }
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
        const nickname = request.url.split('?')[1].split('=')[1];
        if (nickname !== undefined) {
          const chatCloseLog = new ChatCloseLog({
            nickname: nickname,
          });
          await chatCloseLog.save();
        }

        console.log(
          'Client disconnected:',
          socket._socket.remoteAddress,
          socket._socket.remotePort,
        );
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
