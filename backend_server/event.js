var router = require('express').Router();
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var Event = require('./models/event');
var User = require('./models/user');
var config = require('./config');

function datareader(collection, params) {
  return new Promise( (resolve, reject) => {
    collection.findOne(params,  (e, d) => {
      if (e) reject(e);
      else resolve(d);
    })
  })
}


class EventData {
  constructor(event) {
    this.id = event._id;
    this.name = event.name;
    this.status = event.status;
    this.date = event.date;
  }
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
router.post('/new_event', function (req, res, next){
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
  let event = new Event;
  event.name = req.body.name;
  event.status = req.body.status;
  event.date = req.body.date;
  event.place = req.body.place;
  event.members = req.body.members;
  event.additional = req.body.additional;
  event.save(function (err) {
    if (err) { res.json(err)}
    else {
      let createdEvent = new EventData(event);
      let servicePromise = datareader(User, params);
      servicePromise
        .then((response) =>{
          var user = new UserData(response);
          User.update({username: user.username}, {$push: {events:createdEvent}}, (e, d) => {
            if (e) throw new Error();
            else res.json(d)
          });
        });
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
router.get('/event/:id/', function (req, res, next) {
  Event.findOne({
    $or: [
      {_id: req.params.id},
      {name: req.params.name}
    ]
  }, function(err, event) {
    if (err) {
      return res.sendStatus(500)}
    else {
      return res.json(event);

    }
  })
});

module.exports = router;
