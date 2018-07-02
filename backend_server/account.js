// импортируем роутер
var router = require('express').Router()

// импортируем jwt для декодирования web-token'а
var jwt = require('jwt-simple')

// импортируем конфиг
var config = require('./config')

// импортируем модель user
var User = require('./models/user')

/**
 * Эта функция при попытке доступа к URL без корректного web-token'а возвращает 401. При наличии оного - возвращает имя пользователя.
 */

router.get('/account', function(req, res, next){
  console.log('req.headers: ' + req.headers, typeof  req);
    if (!req.headers['authorization']) {
      console.log('Err 1');
      return res.sendStatus(401)}
    try {
        var username = jwt.decode(req.headers['authorization'], config.secretkey).username
    } catch(err) {
      console.log('Err 2');
        return res.sendStatus(401)
    }
    User.findOne({username: username}, function(err, user){
      console.log('user: ' + user);
        if (err) {
          console.log('Err 3');
            return res.sendStatus(500)
        } // ошибка БД, возвращаем 500 - Internal Server Error
        if (!user) {
          console.log('Err 4');
          return res.sendStatus(401)} // пользователя нет в БД, возвращаем 401 - Unauthorized
      console.log('res: ' +res);
        res.json(user) // если всё в порядке, возвращаем JSON с user
    })
})

module.exports = router;
