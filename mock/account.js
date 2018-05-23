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
    if (!req.headers['x-auth']) { return res.sendStatus(401)}
    try {
        var username = jwt.decode(req.headers['x-auth'], config.secretkey).username
    } catch(err) {
        return res.sendStatus(401)
    }
    User.findOne({username: username}, function(err, user){
        if (err) {
            return res.sendStatus(500)
        } // ошибка БД, возвращаем 500 - Internal Server Error
        if (!user) { return res.sendStatus(401)} // пользователя нет в БД, возвращаем 401 - Unauthorized
        res.json(user) // если всё в порядке, возвращаем JSON с user
    })
})

module.exports = router
