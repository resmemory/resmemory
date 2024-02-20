import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const directory = process.env.DIRECTORY;

function frontconnection(pathname, req, res) {
  let filePath;
  if (pathname == '/') {
    filePath = `./${directory}/client/index.html`;
  } else {
    filePath = `./${directory}/client${pathname}`;
    if (pathname.endsWith('index.js')) {
      if (req.headers['accept-encoding'].includes('br')) {
        filePath = filePath + '.br';
        res.writeHead(200, { 'Content-Type': 'application/javascript', 'Content-Encoding': 'br' });
      } else if (
        req.headers['accept-encoding'].includes('gzip') &&
        !req.headers['accept-encoding'].includes('br')
      ) {
        filePath = filePath + '.gz';
        res.writeHead(200, {
          'Content-Type': 'application/javascript',
          'Content-Encoding': 'gzip',
        });
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
      }
    } else if (pathname.endsWith('.js') && !pathname.endsWith('index.js')) {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
    } else if (pathname.endsWith('.jsx')) {
      res.writeHead(200, { 'Content-Type': 'text/jsx' });
    } else if (pathname.endsWith('.css')) {
      res.writeHead(200, { 'Content-Type': 'text/css' });
    } else if (pathname.endsWith('.png')) {
      res.writeHead(200, { 'Content-Type': 'image/png' });
    } else if (pathname.endsWith('.svg')) {
      res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
    } else if (pathname.endsWith('.html')) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
    } else {
      filePath = `./${directory}/client/index.html`;
      res.writeHead(200, { 'Content-Type': 'text/html' });
    }
  }

  const readStream = fs.createReadStream(filePath);
  readStream.on('error', () => {
    filePath = `./${directory}/client/notfound.html`;
    const readStream404 = fs.createReadStream(filePath);
    res.writeHead(404, { 'Content-Type': 'text/html' });
    readStream404.pipe(res);
  });
  readStream.pipe(res);
}

export default frontconnection;
