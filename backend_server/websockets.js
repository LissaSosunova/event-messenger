const Chat = require('./models/chats');
const WebSocketServer = new require('ws');
const socketPort = 8081;
const datareader = require('./datareader');

function runWebsocketServer() {
    const webSocketServer = new WebSocketServer.Server({
        port: socketPort
      });
      
      console.log('WebSocketServer running on port ' + socketPort);
      
      const clients = {};
      
      webSocketServer.on('connection', function(ws) {
        
        console.log("новое соединение");
        let userId;
        let chatIdCurr;
        let chatIdPrev;
        let sendMes;
        let token;
        ws.on('message', function(message) {
          /* 
          sender {
            authorId?: string;
            token?: string;
            curr?: undefined | string;
            prev?: undefined | string;
            deleteAuthorId?: string;
            destination?: string;
            chatID?: string;
            authorId?: string;
            destination?: string;
            text?: string;
            edited?: boolean;
            read?: string[]; надо будет поменять на масив строк, сейчас boolean
            date?: string;
            time:? string;
            isDeleted: {
              [id: string]: boolean
            }
          }
          */
          const sender = JSON.parse(message);
          console.log('message on server', sender);
          if (sender.authorId) {
            userId = sender.authorId;
            token = sender.token;
            if (!clients[userId]) {
              clients[userId] = {};
            }
            clients[userId][token] = ws;
            console.log(`Пользователь ${userId} online`);
          }
          if (sender.curr && sender.curr != 'undefined') {
            chatIdCurr = sender.curr;
            if (!clients[chatIdCurr]) {
                clients[chatIdCurr] = {};
            }
            if (!clients[chatIdCurr][userId]) {
              clients[chatIdCurr][userId] = {};
            }
            clients[chatIdCurr][userId][token] = ws;
            chatIdPrev = sender.prev;
            console.log(`Пользователь ${userId} вошёл в чат!`);
            if (chatIdPrev != 'undefined') {
              delete clients[chatIdPrev][userId][token];
            }
          }
          if (sender.prev !== undefined && sender.prev !== 'undefined') {
              console.log('sender.prev', sender.prev, sender.curr);
            delete clients[sender.prev][userId][token];
            console.log(`Пользователь ${userId} вышел из чата`);
          }

          if (sender.deleteAuthorId) {
            console.log(`пользователь ${userId} не в сети`);
            delete clients[userId][token];
          }
          
          if(!sender.text && !sender.destination) return; 
          if(clients[chatIdCurr] && clients[chatIdCurr][sender.destination] && sender.text) {
            
            // if (sender.notification === true || sender.notification === false) {
            //   clients[chatIdCurr][sender.destination].send(sendMes);
            //   console.log('notification', sender.notification);
            //   return;
            // }
            sender.read = true;
            sender.isDeleted = {};
            sender.isDeleted[sender.destination] = false;
            sender.isDeleted[sender.authorId] = false;
            const updateParams = {
              query: {$and:[{users: userId}, {users: sender.destination}]},
              objNew: {$push: {messages: {$each: [sender], $position: 0}}}
            }
            datareader(Chat, updateParams, 'updateOne')
            .then(res => {
              console.log('chats update', res);
            })
            .catch(err => {
              throw new Error(err);
            });
            console.log('Отправленное сообщение', sender);
            sendMes = JSON.stringify(sender);

           Object.keys(clients[chatIdCurr][sender.destination]).forEach(item => {
            clients[chatIdCurr][sender.destination][item].send(sendMes);
           })
            }
          else if (sender.text) {
            sender.read = false;
            sender.isDeleted = {};
            sender.isDeleted[sender.destination] = false;
            sender.isDeleted[sender.authorId] = false;
            const updateParams = {
              query: {$and:[{users: userId}, {users: sender.destination}]},
              objNew: {$push: {messages: {$each: [sender], $position: 0}}}
            };
            console.log('Отправленное сообщение', sender);
            datareader(Chat, updateParams, 'updateOne')
            .then(res => {
              console.log('chats update', res);
            })
            .catch(err => {
              throw new Error(err);
            });
          } 
          
        });
      
        ws.on('close', function(data) {
          console.log('соединение закрыто ' + data);
          console.log(`пользователь ${userId} не в сети`);
          delete clients[userId][token];
        });
      });
}
 
module.exports = runWebsocketServer;