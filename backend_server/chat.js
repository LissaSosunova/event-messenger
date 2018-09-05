var router = require('express').Router()
var jwt = require('jwt-simple');
var url = require('url');
var queryString = require('querystring')
var config = require('./config');
var User = require('./models/user');
var Chat = require('./models/chats');
var datareader = require('./datareader');
var datareaderById = require('./datareaderbyid');

class ChatData {
  constructor(chat) {
    this.id = chat._id;
    this.users = chat.users;
    this.email = chat.email;
    this.messages = chat.messages;
  }
}
class MessData {
  constructor(mes) {
    this.author = mes.author;
    this.usename = mes.usename;
    this.text = mes.text;
    this.date = mes.date;
    this.time = mes.time;
  }
}



router.get('/chat/:id/', function (req, res, next){
  let params = req.params.id;
  try {
    var auth = jwt.decode(req.headers['authorization'], config.secretkey);
  } catch (err) {
    return res.sendStatus(401)
  }
  datareaderById(Chat, params)
    .then(response =>{
      res.json(response);
    })
});

router.post('/sendmes/', function (req, res, next){
  let params = req.body.id;
  var message = new MessData(req.body);
  try {
    var auth = jwt.decode(req.headers['authorization'], config.secretkey);
  } catch (err) {
    return res.sendStatus(401)
  }
  datareaderById(Chat, params)
    .then(response =>{
      Chat.updateOne({_id: params}, {$push: {messages: message}}, (e, d) => {
        if (e) console.log(e);
        else res.json(response);
      })
    })
});

router.post('/new_chat/', function (req, res, next) {
  if(!req.headers['authorization']) {
    return res.sendStatus(401)
  }
  try {
    var auth = jwt.decode(req.headers['authorization'], config.secretkey);
  } catch (err) {
    return res.sendStatus(401)
  }
  let params = {
    $or: [
      {username: auth.username},
      {email: auth.username}
    ]
  };
  let chat = new Chat;
  chat.users = req.body.users;
  chat.email = req.body.email;
  chat.messages = [];
  chat.save(function (err) {
    if (err) { res.json(err)}
    else {
      let createdChat = new ChatData(chat);
      datareader(User, params)
        .then((response) => {
        var user1 = '', user2 = '';
        for (let i=0; i<chat.users.length;i++) {
          user1 = chat.users[0];
          user2 = chat.users[1];
        }
          User.updateOne({"username" : user1, "contacts.id" : user2},
            {
              $set : { "contacts.$.private_chat" : createdChat.id }
            }, { upsert: true },
            function(err, result){
            }
          );
          User.updateOne({"username" : user2, "contacts.id" : user1},
            {
              $set : { "contacts.$.private_chat" : createdChat.id }
            }, { upsert: true },
            function(err, result){
            }
          );
        })
        .then(response => {
          res.json(createdChat);
        })
    }
  })
});

module.exports = router;
