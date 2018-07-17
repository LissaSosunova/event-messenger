var router = require('express').Router() // импортируем роутер

// импортируем модуль bcrypt для шифрования паролей (мы же не собираемся хранить их в БД в открытом виде?)
var bcrypt = require('bcrypt');

// импортируем JWT для декодирования web-token'ов
var jwt = require('jwt-simple');
// импортируем модель пользователя и евента
var User = require('./models/user');
var Event = require('./models/event');

// импортируем файл конфигурации (баловство, конечно, надо генерировать это на лету и хранить где-нибудь)
var config = require('./config');

function datareader(collection, params) {
  return new Promise(function (resolve, reject) {
    collection.findOne(params, function (e, d) {

      if (e) reject(e);

      else resolve(d);
    })
  })
}

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
  var user = new User;
  user.username = req.body.username;
  user.email = req.body.email;
  user.name = "Unnamed";
  user.avatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNLzZszQbQf6jkknIGI8A3rj-0BoEngyi9156njfrCjPED9_b2vw";
  var password = req.body.password;
  bcrypt.hash(password, 10, function(err, hash){
    if (err){res.json(err)}
    else {
      user.password = hash;
      user.save(function (err) {
        if (err) { res.json(err)}
        else {
          res.sendStatus(201)
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
  let servicePromise = datareader(User, params);
  servicePromise
    .then((response) =>{
      return new Promise(function(resolve, reject) {
        let contactsArr = [],
          oneUser = {},
          stop = 0,
          length = response.contacts.length,
          data = response;
        if (length === 0) {
          data.contacts = contactsArr;
          resolve(response);
        } else {
          for (let i = 0; i < length; i++) {
            let params = {username: response.contacts[i]};
            let newUserContacts = datareader(User, params);
            newUserContacts
              .then((response) => {
                oneUser = {
                  "name": response.name,
                  "id": response.username,
                  "avatar": response.avatar
                };
                contactsArr.push(oneUser);
                stop = stop + 1;
                if (length === stop) {
                  data.contacts = contactsArr;
                  response = data;
                  resolve(response);
                }
                return contactsArr;
              });
          }
        }
      })
        .then((response) =>{
        var user = new UserData(response);
          return new Promise(function(resolve, reject){
            let eventsAll = {
                currentEvents: {
                  title: "Current Events",
                  data: []
                },
                draftEvents: {
                  title: "Draft Events",
                  data: []
                }
              },
              oneEvent = {},
              stop = 0,
              length = user.events.length,
              data = user;
            if(length === 0){
              data.events = eventsAll;
              res.json(user);
            } else {
              for (let i =0; i < length; i++){
                let params = {_id: response.events[i]};
                let newUserEvents = datareader(Event, params);
                newUserEvents
                  .then((response) =>{
                    if(response.status === true){
                      eventsAll.currentEvents.data.push(oneEvent = {
                        "name": response.event.name,
                        "id": response._id,
                        "status": response.status,
                        "date": response.date
                      });
                    }
                    if(response.status === false){
                      eventsAll.draftEvents.data.push(oneEvent = {
                        "name": response.name,
                        "id": response.id,
                        "status": response.status
                      })
                    }
                    stop = stop + 1;
                    if(length === stop){
                      user.events = eventsAll;
                      res.json(user);
                    }
                    return eventsAll;
                  })
              }
            }
          })
        })

    })

});

module.exports = router;
