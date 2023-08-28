import fs from 'fs';

function frontconnection(pathname, res) {
  let filePath;
  if (pathname == '/') {
    filePath = './src/public/index.html';
  } else {
    filePath = `./src/public${pathname}`;
    if (pathname.endsWith('.js')) {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
    } else if (pathname.endsWith('.css') || pathname.endsWith('.ttf')) {
      res.writeHead(200, { 'Content-Type': 'text/css' });
    } else if (pathname.endsWith('.png')) {
      res.writeHead(200, { 'Content-Type': 'image/png' });
    } else {
      filePath = `./src/public${pathname}.html`;
      res.writeHead(200, { 'Content-Type': 'text/html' });
    }
  }

  const readStream = fs.createReadStream(filePath);
  readStream.on('error', () => {
    filePath = `./src/public/notfound.html`;
    const readStream404 = fs.createReadStream(filePath);
    res.writeHead(404, { 'Content-Type': 'text/html' });
    readStream404.pipe(res);
  });
  readStream.pipe(res);
}

export default frontconnection;
