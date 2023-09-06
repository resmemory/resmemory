import http from 'http';
import url from 'url';
import TcpClient from './classes/client';
import { makePacket } from './utils/makePacket';
import authmiddleware from './authmiddleware';
import frontconnection from './frontconnection';
import dotenv from 'dotenv';
import formidable, { errors as formidableErrors } from 'formidable';

dotenv.config();

const port = process.env.GATE_PORT;

let mapClients = {};
let mapUrls = {};
let mapResponse = {};
let mapRR = {};
let index = 0;

export const server = http
  .createServer(async (req, res) => {
    try {
      const method = req.method;
      const uri = url.parse(req.url, true);
      const pathname = uri.pathname;
      let params = {};
      let refresh;

      if (req.headers.cookie) {
        refresh = req.headers.cookie.refresh;

        if (refresh) {
          params.refresh = refresh;
        }
      }

      if (
        (method == 'POST' || method == 'PATCH' || method == 'DELETE') &&
        !pathname.startsWith('/api')
      ) {
        throw new Error('올바른 요청이 아닙니다.');
      }
      if (method === 'POST' && pathname == '/api/posts') {
        let path = pathname.replace('/api', '');
        const form = formidable({});
        let fields;
        let files;
        try {
          [fields, files] = await form.parse(req);
        } catch (err) {
          // example to check for a very specific error
          if (err.code === formidableErrors.maxFieldsExceeded) {
          }
          console.error(err);
          res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
          res.end(String(err));
          return;
        }
        if (fields.authorization[0]) {
          const authorization = fields.authorization[0];
          const userId = authmiddleware(req, res, authorization);

          params = { userId };
        }
        params.bodies = {};
        params.bodies.annualCategory = fields.annualCategory[0];
        params.bodies.title = fields.title[0];
        params.bodies.content = fields.content[0];
        params.bodies.img = files.img[0];
        console.log(params);
        req.on('end', function () {
          onRequest(res, method, path, params);
        });
      }
      if (method === 'POST' && pathname !== '/api/posts') {
        if (req.headers.authorization) {
          const authorization = req.headers.authorization;
          const userId = authmiddleware(req, res, authorization);

          params = { userId };
        }
        let body = '';
        let path = pathname.replace('/api', '');

        req.on('data', function (data) {
          body += data;
        });

        req.on('end', function () {
          if (req.headers['content-type'] === 'application/json') {
            params.bodies = JSON.parse(body);
          }
          onRequest(res, method, path, params);
        });
      } else if (method === 'PATCH') {
        let body = '';
        const authorization = req.headers.authorization;
        const userId = authmiddleware(req, res, authorization);

        let path = pathname.replace('/api', '');
        params = { userId };

        req.on('data', function (data) {
          body += data;
        });

        req.on('end', function () {
          if (req.headers['content-type'] === 'application/json') {
            params.bodies = JSON.parse(body);
          }

          const pathArray = path.split('/');
          if (pathArray.length > 2) {
            path = path.substring(0, path.lastIndexOf('/'));
            params.params = pathArray.pop();
          }

          onRequest(res, method, path, params);
        });
      } else if (method === 'DELETE') {
        const authorization = req.headers.authorization;
        const userId = authmiddleware(req, res, authorization);

        params = { userId };
        let body = '';
        let path = pathname.replace('/api', '');

        req.on('data', function (data) {
          body += data;
        });

        req.on('end', function () {
          if (req.headers['content-type'] === 'application/json') {
            params.bodies = JSON.parse(body);
          }
          const pathArray = path.split('/');
          if (pathArray.length > 2) {
            path = path.substring(0, path.lastIndexOf('/'));
            params.params = pathArray.pop();
          }

          onRequest(res, method, path, params);
        });
      } else {
        if (!pathname.startsWith('/api')) {
          frontconnection(pathname, res);
        } else {
          let path = pathname.replace('/api', '');
          if (req.headers.authorization) {
            const authorization = req.headers.authorization;
            const userId = authmiddleware(req, res, authorization);

            params = { userId };
          }
          const pathArray = path.split('/');
          if (pathArray.length > 2) {
            path = path.substring(0, path.lastIndexOf('/'));
            params.params = pathArray.pop();
          }
          params.query = uri.query;
          onRequest(res, method, path, params);
        }
      }
    } catch (error) {
      console.log('---------------', error);
      res
        .writeHead(200, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ responseData: { code: 100 } }));
    }
  })
  .listen(port, () => {
    console.log(`Example app listening on port ${port}`);

    // Distributor 와 통신 처리
    const packet = makePacket('/distributes', 'POST', 0, {
      port: process.env.GATE_PORT,
      name: 'gate',
      urls: [],
    });

    let isConnectedDistributor = false;

    const clientDistributor = new TcpClient(
      process.env.HOST,
      process.env.DIS_PORT,
      (options) => {
        // 접속 이벤트
        isConnectedDistributor = true;
        clientDistributor.write(packet);
      },
      (options, data) => {
        onDistribute(data);
      }, // 데이터 수신 이벤트
      (options) => {
        isConnectedDistributor = false;
      }, // 접속 종료 이벤트
      (options) => {
        isConnectedDistributor = false;
      }, // 에러 이벤트
    );

    // 주기적인 Distributor 접속 상태 확인
    setInterval(() => {
      if (isConnectedDistributor !== true) {
        clientDistributor.connect();
      }
    }, 3000);
  });

export function onRequest(res, method, pathname, params) {
  const key = method + pathname;
  const client = mapUrls[key];
  if (client == null) {
    res.writeHead(404);
    res.end();
  } else {
    const packet = makePacket(pathname, method, index, params);

    mapResponse[`key_${index}`] = res;
    index++;
    if (mapRR[key] == null) {
      mapRR[key] = 0;
    }

    mapRR[key]++;
    client[mapRR[key] % client.length].write(packet);
  }
}

export function onDistribute(data) {
  for (let n in data.params) {
    const node = data.params[n];
    const key = node.host + ':' + node.port;

    if (mapClients[key] == null && node.name !== 'gate') {
      const client = new TcpClient(
        node.host,
        node.port,
        onCreateClient,
        onReadClient,
        onEndClient,
        onErrorClient,
      );

      mapClients[key] = {
        client: client,
        info: node,
      };

      for (let m in node.urls) {
        const key = node.urls[m];
        if (mapUrls[key] == null) {
          mapUrls[key] = [];
        }
        mapUrls[key].push(client);
      }
      client.connect();
    }
  }
}

// 마이크로서비스 접속 이벤트 처리
function onCreateClient(options) {
  console.log('onCreateClient');
}

// 마이크로서비스 응답 처리
function onReadClient(options, packet) {
  if (packet.responseData.code == 121) {
    mapResponse[`key_${packet.key}`].setHeader(
      'Authorization',
      `Bearer ${packet.responseData.token}`,
    );
    delete packet.token;
    mapResponse[`key_${packet.key}`].end(JSON.stringify(packet));
  } else if (packet.responseData.code == 111) {
    const today = new Date();

    mapResponse[`key_${packet.key}`].setHeader('Set-Cookie', [
      `refresh=${packet.responseData.refresh}; expires=7d`,
    ]);
    mapResponse[`key_${packet.key}`].end(JSON.stringify(packet));
    delete packet.responseData.refresh;
  } else if (packet.responseData.code == 123) {
    mapResponse[`key_${packet.key}`].setHeader(
      'Authorization',
      `Bearer ${packet.responseData.token}`,
    );
    delete packet.responseData.refresh;
    delete packet.token;
    mapResponse[`key_${packet.key}`].end(JSON.stringify(packet));
  } else if (packet.responseData.code == 131 || packet.responseData.code == 141) {
    mapResponse[`key_${packet.key}`].removeHeader('Set-Cookie');
    mapResponse[`key_${packet.key}`].removeHeader('Authorization');
    mapResponse[`key_${packet.key}`].end(JSON.stringify(packet));
  } else if (packet.responseData.code == 1211) {
    frontconnection('/oauth', mapResponse[`key_${packet.key}`], packet.responseData.kakaocode);
  } else {
    mapResponse[`key_${packet.key}`].writeHead(200, { 'Content-Type': 'application/json' });
    mapResponse[`key_${packet.key}`].end(JSON.stringify(packet));
    delete mapResponse[`key_${packet.key}`];
  }
}

// 마이크로서비스 접속 종료 처리
function onEndClient(options) {
  const key = options.host + ':' + options.port;
  console.log('onEndClient', mapClients[key]);

  for (let n in mapClients[key].info.urls) {
    const node = mapClients[key].info.urls[n];
    delete mapUrls[node];
  }
  delete mapClients[key];
}

// 마이크로서비스 접속 에러 처리
function onErrorClient(options) {
  console.log('onErrorClient');
}
