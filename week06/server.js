/*
 * @Author: your name
 * @Date: 2020-05-10 20:43:59
 * @LastEditTime: 2020-05-19 19:53:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \uap-admin-prodd:\工作内容\Project\训练营\20200510\server.js
 */

const http = require('http');

const server = http.createServer((req, res) => {
  console.log('received')
  console.log(req.headers)
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar')
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(
`<html maaa=a >
<head>
    <style>
body div #myid{
    width:100px;
    background-color: #ff5000;
}
body div img{
    width:30px;
    background-color: #ff1111;
}
    </style>
</head>
<body>
    <div>
        <img id="myid"/>
        <img />
    </div>
</body>
</html>`);
});

server.listen(8090)