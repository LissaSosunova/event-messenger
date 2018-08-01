var router = require('express').Router();
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var Event = require('./models/event');
var User = require('./models/user');
var config = require('./config');
var datareader = require('./datareader');

class EventData {
  constructor(event) {
    this.id = event._id;
    this.name = event.name;
    this.status = event.status;
    this.date = event.date;
    this.notification = event.notification;
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
  event.notification = { type: 'event', message: 'You are invited to new event', id: '', status: true};
  event.save(function (err) {
    if (err) { res.json(err)}
    else {
      let createdEvent = new EventData(event);
      datareader(User, params)
        .then((response) =>{
          User.updateOne({username: response.username}, {$push: {events:createdEvent}}, (e, d) => {
            if (e) throw new Error();
            else return response;
          })
        })
        .then((response) =>{
          if(event.members.invited.length !== 0){
            event.notification.id = event._id;
            event.members.invited.forEach(function (item) {
              User.updateOne({username: item.username}, {$push: {events:createdEvent}}, (e, d) => {
                if (e) throw new Error();
                else return response;
              });
              if(event.status === true){
                User.updateOne({username: item.username}, {$push: {notifications:event.notification}}, (e, d) => {
                  if (e) throw new Error();
                  else return response;
                });
              }
            });
          }
        })
        .then((response) => {
        res.sendStatus(200);
        })
    }
  })
});



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

router.post('/change_status/', function (req, res, next) {
  if(!req.headers['authorization']) {
    return res.sendStatus(401)
  }
  try {
    var auth = jwt.decode(req.headers['authorization'], config.secretkey);
  } catch (err) {
    return res.sendStatus(401)
  }
  let idNotification = req.body.id;
  let params = {
    $or: [
      {username: auth.username},
      {email: auth.username}
    ]
  };
  datareader(User, params)
    .then(response =>{
      User.updateOne({"username" : response.username, "notifications.id" : idNotification},
        {
          $set : { "notifications.$.status" : false }
        }, { upsert: true },
        function(err, result){
        }
      );
      return res.sendStatus(200)
    })
});

module.exports = router;
