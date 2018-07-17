var router = require('express').Router();
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var Event = require('./models/event');
var config = require('./config');

router.post('/new_event', function (req, res, next){
  var event = new Event;
  event.name = req.body.name;
  event.status = req.body.status;
  event.date = req.body.date;
  event.place = req.body.place;
  event.members = req.body.members;
  event.additional = req.body.additional;
  event.save(function (err) {
    if (err) { res.json(err)}
    else {
      res.sendStatus(201)
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
router.get('/event', function (req, res, next) {
  Event.findOne({
    $or: [
      {_id: req.body.id},
      {name: req.body.name}
    ]
  }, function(err, event) {
    if (err) {
      return res.sendStatus(500)}
    else {
      console.log(event);

      return res.json(event);

    }
  })
});

module.exports = router;
