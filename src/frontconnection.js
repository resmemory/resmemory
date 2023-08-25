import fs from 'fs';
import path from 'path';

function frontconnection(pathname, res) {
  let filePath;
  if (pathname == '/main') {
    filePath = './src/public/main.html';
  }
  if (pathname == '/') {
    filePath = './src/public/index.html';
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
}

export default frontconnection;
