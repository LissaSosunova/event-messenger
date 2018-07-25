var router = require('express').Router()
var jwt = require('jwt-simple');
var url = require('url');
var queryString = require('querystring')
var config = require('./config');
var User = require('./models/user');
var Chat = require('./models/chats');

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

let promise = new Promise((resolve, reject) => {
  User.findOne(params, {chats:{$elemMatch:{id: id}}}, (e, d) => {
    if (e) reject(e);
    else if (d.chats == false) {
      User.findOne({username: id}, (e, d) => {
        if (e) throw new Error ()
        else {
          let chats = {};
          chats.id = d.username;
          chats.name = d.name;
          chats.avatar = d.avatar;
          User.updateOne(params, {$push: {chats: chats}}, (e, d) => {
            if (e) throw new Error()
            else console.log(d)
          })
        }
      })
      Chat.findOne({$and:[{users: id, $or:[{users: auth.username},{email: auth.username}]}]}, (e, d) => {
        if (e) throw new Error()
        else if (d == null) {
          User.findOne(params, (error, data) => {
            if (error) throw new Error()
            else {
            let myId = data.username;
            let email = data.email;
            let chat = new Chat;
            chat.users.push(myId);
            chat.users.push(id);
            chat.email.push(email);
            User.findOne({username: id}, (er, dt) => {
              if (er) throw new Error()
              else {
                let userEmail = dt.email;
                  chat.email.push(userEmail);
                  chat.save(err => {
                    if (err) console.log(err)
                    else {
                      console.log("chat doc was saved");
                      resolve();
                    }
                  })
                }
            })
          }
        })
        }
      })
    }
    else {
      resolve()
    }
  })
})
promise.then(()=>{
  Chat.findOne({$and:[{users: id, $or:[{users: auth.username},{email: auth.username}]}]}, (error, data) => {
    if (error) throw new Error()
    else {
    res.json(data);
    }
  })
},
error => {
  throw new Error (error)
}) 
   
})

module.exports = router;