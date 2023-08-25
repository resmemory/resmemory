import fs from 'fs';

function frontconnection(pathname, method, res) {
  if (pathname == '/' && method == 'GET') {
    fs.readFile('./src/public/index.html', { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        res.write(data, 'utf8');
        res.end();
      }
    });
  }
}

export default frontconnection;
