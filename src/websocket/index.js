/**
 * @type {WebSocket|WebSocket}
 * 一个websocket服务器可以同时跟多个客户端通信（使用同一个端口）
 * 一个客户端也可以同时跟多个服务器建立连接（每个服务器的端口号不同）
 */

const WebSocket = require('ws');
const defaultProtocol = 'ws';
const defaultHost = '127.0.0.1';
const defaultPort = 3600;

/**
 * 创建websocket服务端
 * @param port：为websocket连接指定的端口号；
 */
const createWebSocketServer = function (port = defaultPort) {
  const wss = new WebSocket.Server({
    port: port
  });
  /**
   * 监听与客户端建立连接的connection事件
   * 回调函数：
   *  ws参数：客户端传递过来的websocket对象
   */
  wss.on('connection', function(ws) {
    console.log('one client is connected');

    /**
     * 接受客户端发送过来的消息
     */
    ws.on('message', function(msg){
      console.log(msg);
      // 实现消息广播，但是不发给当前消息的来源客户端
      wss.clients.forEach((client) => {

      })
    });

    ws.send("Message from server");
  });
};

/**
 *  创建websocket客户端：node端不仅可以作为服务器端，还可以作为客户端与其他服务器端进行通信
 */
const createWebSocketClient = function(protocol = defaultProtocol, host = defaultHost, port = defaultPort) {
  const url = `${protocol}://${host}:${port}`;
  const ws = new WebSocket(url);
  // 与服务器端建立连接
  ws.on('open', function(){
    ws.send('node client say hello to server!!');
    ws.on('message', function(event){
      console.log(event);
    })
  })
};

module.exports = {
  createWebSocketClient,
  createWebSocketServer,
};


