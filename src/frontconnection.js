import fs from 'fs';

function frontconnection(pathname, res) {
  let filePath;
  if (pathname == '/main') {
    filePath = './dist/public/main.html';
  }
  if (pathname == '/') {
    filePath = './dist/public/index.html';
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
}

export default frontconnection;
