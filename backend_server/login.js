// импортируем роутер
var router = require('express').Router()

// импортируем bcrypt, здесь он нужен для сверки пароля с хешем из БД
var bcrypt = require('bcrypt')

// импортируем jwt чтобы создавать web-token'ы для последующей отправки пользователю
var jwt = require('jwt-simple')

// импортируем файл конфигурации
var config = require('./config')

// импортируем модельку user
var User = require('./models/user')

/**
 * Этот модуль имеет единственный метод. При получении запроса типа POST, в котором содержится логин и пароль,
 * эта функция ищет в БД пользователя с таким username, получает хеш его пароля и сверяет с помощью bcrypt с полученным
 * в запросе паролем. При ошибках обработки возвращает статус 500. При неправильных данных - 401 - Unauthorized.
 * При успехе возвращает токен.
 */

router.post ('/login', function(req, res, next){
    if (!req.body.username || !req.body.password) {
        return res.sendStatus(400) // если один или оба параметра запроса опущены, возвращаем 400 - Bad Request
    } else {
        var username = req.body.username;
        var password = req.body.password;
        User.findOne(
          {
            $or: [
              {username: username},
              {email: username}
            ]
          }
           )
        .select('password') // указываем явно, что нам нужно значение поля password (ибо его выборка отключена в модели)
        .exec(function(err, user){
            if (err) {
                return res.json(err)
            }
            if (!user) {
              console.log('no user');
              return res.json(err)}
            bcrypt.compare(password, user.password, function(err, valid){
            if (err) {
              console.log(err);
              return res.json(err)
            }
            if (!valid){
              console.log('not valid');
              return res.json(err)}
            var token = jwt.encode({username: username}, config.secretkey)
            res.json({"success": true, access_token: token})
          })
        })
    }
})

module.exports = router;
