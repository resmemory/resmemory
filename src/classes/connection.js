import net from 'net';

export default class Connections {
  /* * 생성자 */
  constructor(host, port, packet) {
    let isConnectedGetPosts;
    this.options = {
      host: host,
      port: port,
    };
    this.onCreate = (options) => {
      isConnectedGetPosts = true;
      this.clientGetPosts.write(packet);
    };
    this.onEnd = (options) => {
      isConnectedGetPosts = false;
    };
    this.onError = (options) => {
      isConnectedGetPosts = false;
    };
  }

  /* * 접속 함수 */
  connect() {
    this.client = net.connect(this.options, () => {
      if (this.onCreate) this.onCreate(this.options);
    });

    // 데이터 수신 처리
    this.client.on('data', async (data) => {
      let sz = this.merge ? this.merge + data.toString() : data.toString();
      let arr = sz.split('¶');
      for (let n in arr) {
        if (sz.charAt(sz.length - 1) !== '¶' && n === arr.length - 1) {
          this.merge = arr[n];
          break;
        } else if (arr[n] === '') {
          break;
        } else {
          return await JSON.parse(arr[n]);
        }
      }
    });

    // 접속 종료 처리
    this.client.on('close', () => {
      if (this.onEnd) this.onEnd(this.options);
    });

    // 에러 처리
    this.client.on('error', (err) => {
      if (this.onError) this.onError(this.options, err);
    });
  }

  /*
   * 데이터 발송
   */
  write(packet) {
    this.client.write(JSON.stringify(packet) + '¶');
  }
}
