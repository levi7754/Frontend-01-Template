const http = require('http');
const fs = require('fs');
const unzip = require('unzipper');

const server = http.createServer((req, res) => {
  // const matched = req.url.match(/filename=([^&]+)/);
  // const filename = matched && matched[1];
  // if (!filename) return;
  // const writeStream = fs.createWriteStream("../server/public/" + filename)
  const writeStream = unzip.Extract({path: '../server/public'})
  req.pipe(writeStream)
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('ok');
  })
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8089);