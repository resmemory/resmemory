import fs from 'fs';

function frontconnection(pathname, res) {
  let filePath;
  if (pathname == '/') {
    filePath = './src/public/index.html';
  } else {
    filePath = `./src/public${pathname}`;
    if (pathname.endsWith('.html')) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
    } else if (pathname.endsWith('.js')) {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
    } else if (pathname.endsWith('.css') || pathname.endsWith('.ttf')) {
      res.writeHead(200, { 'Content-Type': 'text/css' });
    } else if (pathname.endsWith('.png')) {
      res.writeHead(200, { 'Content-Type': 'image/png' });
    }
  }

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
}

export default frontconnection;
