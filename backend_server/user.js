var router = require('express').Router() // импортируем роутер

// импортируем модуль bcrypt для шифрования паролей (мы же не собираемся хранить их в БД в открытом виде?)
var bcrypt = require('bcrypt');

// импортируем JWT для декодирования web-token'ов
var jwt = require('jwt-simple');
// импортируем модель пользователя
var User = require('./models/user');

// импортируем файл конфигурации (баловство, конечно, надо генерировать это на лету и хранить где-нибудь)
var config = require('./config');


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
    console.log('No token', req.headers);
    return res.sendStatus(401)
  }
  try {
    var auth = jwt.decode(req.headers['authorization'], config.secretkey);
    console.log(auth);
  } catch (err) {
    return res.sendStatus(401)
  }
  User.findOne({
    $or: [
      {username: auth.username},
      {email: auth.username}
    ]
  }, function(err, user) {
    if (err) {
      return res.sendStatus(500)}
    else {
      console.log(user);
      res.json(user)
    }
  })
})

module.exports = router;
