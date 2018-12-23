const Chat = require('./models/chats');
const WebSocketServer = new require('ws');
const socketPort = 8081;

function runWebsocketServer() {
    const webSocketServer = new WebSocketServer.Server({
        port: socketPort
      });
      
      console.log('WebSocketServer running on port ' + socketPort);
      
      const clients = {};
      
      webSocketServer.on('connection', function(ws, req) {
        
        console.log("новое соединение");
        let id;
        let chatIdCurr;
        let chatIdPrev;
        let sendMes;
        ws.on('message', function(message) {
          const sender = JSON.parse(message);
          console.log('message on server', sender);
          if (sender.authorId) {
            id = sender.authorId;
            clients[id] = ws;
            ws.id = sender.authorId;
            console.log(`Пользователь ${id} online`);
          }
          if (sender.curr && sender.curr != 'undefined') {
            chatIdCurr = sender.curr;
            if (!clients[chatIdCurr]) {
                clients[chatIdCurr] = {};
            }
            clients[chatIdCurr][id] = ws;
            chatIdPrev = sender.prev;
            console.log(`Пользователь ${id} вошёл в чат!`);
            if (chatIdPrev != 'undefined') {
              delete clients[chatIdPrev][id];
            }
          }
          if (sender.prev !== undefined && sender.prev !== 'undefined') {
              console.log('sender.prev', sender.prev, sender.curr);
            delete clients[sender.prev][id];
            console.log(`Пользователь ${id} вышел из чата`);
          }

          if (sender.deleteAuthorId) {
            console.log(`пользователь ${id} не в сети`);
            delete clients[id];
          }
          
          if(!sender.text && !sender.destination) return; 
          if(clients[chatIdCurr] && clients[chatIdCurr][sender.destination] && sender.text) {
            
            // if (sender.notification === true || sender.notification === false) {
            //   clients[chatIdCurr][sender.destination].send(sendMes);
            //   console.log('notification', sender.notification);
            //   return;
            // }
            sender.read = true;
            console.log(`Отправленное сообщение ${sender}`);
            sendMes = JSON.stringify(sender);
           
            clients[chatIdCurr][sender.destination].send(sendMes);
            }
        //   else if (clients[sender.destination]) {
        //     clients[sender.destination].send(message)
        //   }
          if (sender.text) {
            console.log('message', sender);
            Chat.updateOne({$and:[{users: id}, {users: sender.destination}]}, {$push: {messages: {$each: [sender], $position: 0}}}, (e, d) => {
                if (e) throw new Error()
                else {
                  console.log('chats update', d)
                }
              })
          } 
          
        });
      
        ws.on('close', function(data) {
          console.log('соединение закрыто ' + data);
          console.log(`пользователь ${id} не в сети`);
          delete clients[id];
        });
      });
}
 
module.exports = runWebsocketServer;