var router = require('express').Router() // импортируем роутер

// импортируем модуль bcrypt для шифрования паролей (мы же не собираемся хранить их в БД в открытом виде?)
var bcrypt = require('bcrypt');

// импортируем JWT для декодирования web-token'ов
var jwt = require('jwt-simple');
// импортируем модель пользователя и евента
var User = require('./models/user');
var Event = require('./models/event');
var Chat = require('./models/chats');
var datareader = require('./datareader');

// импортируем файл конфигурации (баловство, конечно, надо генерировать это на лету и хранить где-нибудь)
var config = require('./config');


class UserData {
  constructor(user) {
    this.username = user.username;
    this.email = user.email;
    this.name = user.name;
    this.contacts = user.contacts;
    this.events = user.events;
    this.chats = user.chats;
    this.avatar = user.avatar;
  }
}

/**
 * При поступлении запроса типа POST эта функция шифрует пароль с помощью bcrypt и сохраняет результат в БД.
 * При любых ошибках выдает статус 500 - Internal Server Error
 * При удаче - возвращает 201
 */
router.post('/user', function (req, res, next){

  let params = {
    $or: [
      {username: req.body.username},
      {email: req.body.email}
    ]
  };
  let dublicate = {
    name: 'MongoError'
  };
  var user = new User;
  var chat = new Chat;
  user.username = req.body.username;
  chat.username = user.username;
  user.email = req.body.email;
  chat.email = user.email;
  user.name = "No name";
  user.avatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNLzZszQbQf6jkknIGI8A3rj-0BoEngyi9156njfrCjPED9_b2vw";
  user.events = [];
  var password = req.body.password;

  let servicePromise = datareader(User, params);
  servicePromise
    .then((response) =>{
      if (response !== null){
        res.json(dublicate);
      } else {
        bcrypt.hash(password, 10, function(err, hash){
          if (err) res.json(err)
          else {
            user.password = hash;
            user.save(err => {
              if (err) res.json(err)
              else res.sendStatus(201)
            })
            chat.save(err => {
              if (err) console.log(err)
              else console.log("chat doc was saved")
            })
          }
        })
      }
    })
});


/**
 * При поступлении запроса типа GET эта функция проверяет наличие заголовка типа X-Auth-Token, при его отсутствии
 * возвращает 401 - Unauthorized. При наличии расшифровывает токен, содержащийся в заголовке с помощью jwt,
 * затем ищет пользователя с оным именем в базе данных.
 * При любых ошибках возвращает JSON объекта error
 * При успехе возвращает JSON объекта user (без пароля, естественно)
 */


router.get('/user', function (req, res, next) {
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

    User.findOne(params, (e, d) => {
        if (e) throw new Error()
        else {
          let userContacts = d.contacts;
          for (let i=0; i<userContacts.length; i++) {
            User.findOne({username: userContacts[i].id}, (e, d) => {
              if (e) throw new Error()
              else {
                userContacts[i].name = d.name;
                User.updateOne(params, {$set: {contacts: userContacts}}, (e, d) => {
                  if (e) throw new Error()
                  else console.log(d)
                })
              }
            })
          }
        }  
      })
  
    User.findOne(params, (e, d) => {
    if (e) throw new Error()
    else {
      let userChats = d.chats;
      for (let i=0; i<userChats.length; i++) {
        User.findOne({username: userChats[i].id}, (e, d) => {
          if (e) throw new Error()
          else {
            userChats[i].name = d.name;
            User.updateOne(params, {$set: {chats: userChats}}, (e, d) => {
              if (e) throw new Error()
              else console.log(d)
            })
          }
        })
      }
    }  
  })
  
  let servicePromise = datareader(User, params);
  servicePromise
        .then((response) =>{
        var user = new UserData(response);
          res.json(user);
        })
});

router.post('/finduser', function (req, res, next) {
  let query = req.body.param;
  if (query != "") {
    User.find({$or:[{username: {$regex: query}}, {email: {$regex: query}}]},  (e, d) => {
      if (e) throw new Error()
      else res.json(d)
    })
  }
  else {
    res.end()
  }
})

router.post('/adduser', function (req, res, next) {
  let exsistCont = false;
  let query = req.body;
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
  datareader(User, params)
  .then(response => {
    response.contacts.forEach(item => {
      if (query.id === auth.username || item.id === query.id ) {
        exsistCont = true;
        return
        }
    })
    if (query.id === auth.username) exsistCont = true;
    if (exsistCont) return res.json({message: "This contact is already exists"});
      User.updateOne(params, {$push: {contacts: query}}, (e, d) => {
          if (e) throw new Error()
          else res.json(d)
    })
  });
})

module.exports = router;