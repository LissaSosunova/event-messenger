var router = require('express').Router()
var jwt = require('jwt-simple');
var url = require('url');
var queryString = require('querystring')
var config = require('./config');
var User = require('./models/user');
var Chat = require('./models/chats');
var transfer = require('./transferService');

router.get('/chat/', function (req, res, next){
  let param = url.parse(req.url).query;
  let id = queryString.parse(param).id;
  
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
  User.findOne(params, {chats:{$elemMatch:{id: id}}}, (e, d) => {
    if (e) throw new Error()
    else if (d.chats == false) {
            User.findOne({username: id}, (e, d) => {
              if (e) throw new Error ()
              else {
                var chats = {};
                chats.id = d.username;
                chats.name = d.name;
                chats.avatar = d.avatar;
                User.updateOne(params, {$push: {chats: chats}}, (e, d) => {
                  if (e) throw new Error()
                  else console.log(d)
                })
              }
            })
          }
    else return 
  })

   Chat.findOne(params, {messages:{$elemMatch:{_id: id}}}, (error, data) => {
     if (error) throw new Error()
     else if (data.messages == false) {
       res.end()
     }
     else {
       User.findOne({username: id}, (e, d) => {
        if (e) throw new Error ()
        else {
          transfer.setData({name: "name", data: d.name});
          data.messages[0].messages.forEach((item, index) => {
            if (item.id == id) item.author = transfer.getData("name");
          });
        }
      })
      res.json(data.messages[0].messages);
      }
   })
})

module.exports = router;