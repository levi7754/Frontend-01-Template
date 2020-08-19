const http = require('http');
const fs = require('fs');
const archiver = require('archiver');

const packname = './package';

// fs.stat(packname, (error, stat) => {
  
  const options = {
    host: 'localhost',
    port: 8089,
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream'
      // 'Content-length': stat.size
    },
    path: '/?filename=' + 'package.zip'
  };
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });
  archive.directory(packname, false);
  
  const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头: ${JSON.stringify(res.headers)}`);
    // res.setEncoding('utf8');
  });
  
  req.on('error', (e) => {
    console.error(`请求遇到问题: ${e.message}`);
  });
  
  archive.pipe(req);
  archive.on("end", () => {
    req.end();
  })
  archive.finalize();

  // 将数据写入请求主体。
  // const readStream = fs.createReadStream(filename);
  // readStream.pipe(req);
  // readStream.on("end", () => {
  //   req.end();
  // })
// });

