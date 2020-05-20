const net = require('net');
const parser = require('./parser.js')
class Request {
  constructor(options) {
    console.log('-----------------------------')
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || "8090";
    this.body = options.body || {};
    this.path = options.path || "/";
    this.headers = options.headers || {};
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
      console.log(this.headers["Content-Type"])
    }

    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
      // console.log(this.bodyText)
      // console.log('-----------------------------')
    }
    this.headers["Content-Length"] = this.bodyText.length;
  }

  toString() {
    const str = `${this.method} ${this.path} HTTP/1.1
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}
\r
${this.bodyText}`
    return str
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parse = new ResponseParse;
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host, 
          port: this.port
        }, () => {
          connection.write(this.toString())
        })
      }
      connection.on('data', (data) => {
        parse.receive(data.toString())
        // console.log(parse.headers)

        if (parse.isFinished) {
          resolve(parse.getReponse);
        }
        connection.end();
      });
      connection.on('error', (e) => {
        reject(e);
        connection.end();
      });
    })
  }
}

class ResponseParse {
  constructor() {
    this.WAITTING_STATUS_LINE = 0; 
    this.WAITTING_STATUS_LINE_END = 1;
    this.WAITTING_HEADER_NAME = 2; 
    this.WAITTING_HEADER_SPACE = 3;
    this.WAITTING_HEADER_VALUE = 4;
    this.WAITTING_HEADER_LINE_END = 5;
    this.WAITTING_HEADER_BLOCK_END = 6;
    this.WAITTING_BODY = 7;
    
    this.current = this.WAITTING_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParse = null;
  }

  get isFinished() {
    return this.bodyParse && this.bodyParse.isFinished;
  }

  get getReponse() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText:RegExp.$2,
      headers: this.headers,
      body: this.bodyParse.content.join('')
    }
  }

  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i))
    }  
  }

  receiveChar(char) {
    if (this.current === this.WAITTING_STATUS_LINE) {
      // console.log(char)
      if (char === '\r') {
        this.current = this.WAITTING_STATUS_LINE_END
      } else {
        this.statusLine += char
      }
    } else if (this.current === this.WAITTING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITTING_HEADER_NAME
      }
    } else if (this.current === this.WAITTING_HEADER_NAME) {
      if (char === ':') {
        this.current = this.WAITTING_HEADER_SPACE
      } else if (char === '\r') {
        this.current = this.WAITTING_HEADER_BLOCK_END
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParse = new TruckedBodyParse();
        }
      } else {
        this.headerName += char
      }
    } else if (this.current === this.WAITTING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITTING_HEADER_VALUE
      }
    } else if (this.current === this.WAITTING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.WAITTING_HEADER_LINE_END
        this.headers[this.headerName] = this.headerValue
        this.headerName = ""
        this.headerValue = ""
      } else {
        this.headerValue += char
      }
    } else if (this.current === this.WAITTING_HEADER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITTING_HEADER_NAME
      }
    } else if (this.current === this.WAITTING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.current = this.WAITTING_BODY
      }
    } else if (this.current === this.WAITTING_BODY) {
      this.bodyParse.receiveChar(char)
    }

  }
  
}

class TruckedBodyParse {
  constructor() {
    this.WAITTING_LENGTH = 0; 
    this.WAITTING_LENGTH__LINE_END = 1;
    this.READING_TRUNK = 2; 
    this.WAITTING_NEW_LINE = 3;
    this.WAITTING_NEW_LINE_END = 4;
    this.current = this.WAITTING_LENGTH;
    this.length = 0;
    this.isFinished = false;
    this.content = [];
  }

  receiveChar(char) {
    // console.log(JSON.stringify(char))
    if (this.current === this.WAITTING_LENGTH) {
      if (char === '\r') {
        if (this.length === 0) {
          this.isFinished = true
        }
        this.current = this.WAITTING_LENGTH__LINE_END
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    }  else if (this.current === this.WAITTING_LENGTH__LINE_END) {
      if (char === '\n') {
        // console.log('/////WAITTING_LENGTH__LINE_END')
        this.current = this.READING_TRUNK
      }
    }  else if (this.current === this.READING_TRUNK) {
      if (char !== '\n' && char !== '\r') {
        this.content.push(char)
      }
      this.length--;
      if (this.length === 0) {
        this.current = this.WAITTING_NEW_LINE
      }
    } else if (this.current === this.WAITTING_NEW_LINE) {
      if (char === '\r') {
        this.current = this.WAITTING_NEW_LINE_END
      }
    } else if (this.current === this.WAITTING_NEW_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITTING_LENGTH
      }
    }


  }
  
}

void async function() {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: "8090",
    path: "/",
    headers: {
      ["U-TOKEN"]: "12345"
    },
    body: {
      name: "ali"
    }
  })

  const respone = await request.send();
  const dom = parser.parseHTML(respone.body)
  console.log(dom)
  // const aa = JSON.stringify(dom)
  // console.log(JSON.stringify(dom, null, "    "))
}();


/*

const connection = net.createConnection({
  host: "127.0.0.1",
  port: 8090
}, () => {
  // 'connect' 监听器
  console.log('已连接到服务器');
  // connection.write('POST / HTTP/1.1\r\n');
  // console.log('success')
  // connection.write('host: 127.0.0.1\r\n');
  // connection.write('Content-type: application/x-www-form-urlencoded\r\n');
  // connection.write('\r\n');
  // connection.write('field=aaa&code=x%3D1\r\n');
  // connection.write('\r\n');

  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: "8090",
    path: "/",
    headers: {
      ["U-TOKEN"]: "12345"
    },
    body: {
      name: "ali"
    }
  })
  console.log(request.toString())
  connection.write(request.toString())
});
connection.on('data', (data) => {
  console.log(data);
  connection.end();
});
connection.on('end', () => {
  console.log('已从服务器断开');
});
connection.on('error', (e) => {
  console.log(e);
  console.log('服务器错误');
});
*/