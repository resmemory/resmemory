import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const directory = process.env.DIRECTORY;

function frontconnection(pathname, res, data) {
  let filePath;
  if (pathname == '/') {
    filePath = `./${directory}/public/index.html`;
  } else if (pathname == '/oauth') {
    filePath = `./${directory}/public/oauth.html`;
    res.setHeader('code', data);
  } else {
    filePath = `./${directory}/public${pathname}`;
    if (pathname.endsWith('.js')) {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
    } else if (pathname.endsWith('.jsx')) {
      res.writeHead(200, { 'Content-Type': 'text/jsx' });
    } else if (pathname.endsWith('.css')) {
      res.writeHead(200, { 'Content-Type': 'text/css' });
    } else if (pathname.endsWith('.png')) {
      res.writeHead(200, { 'Content-Type': 'image/png' });
    } else {
      filePath = `./${directory}/public${pathname}.html`;
      res.writeHead(200, { 'Content-Type': 'text/html' });
    }
  }

  const readStream = fs.createReadStream(filePath);
  readStream.on('error', () => {
    filePath = `./${directory}/public/notfound.html`;
    const readStream404 = fs.createReadStream(filePath);
    res.writeHead(404, { 'Content-Type': 'text/html' });
    readStream404.pipe(res);
  });
  readStream.pipe(res);
}

export default frontconnection;
