import fs from 'fs';

function frontconnection(pathname, res) {
  let filePath;
  if (pathname == '/') {
    filePath = './dist/public/index.html';
  } else {
    filePath = `./dist/public${pathname}`;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
}

export default frontconnection;
