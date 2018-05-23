var db = require('./db')
var event = db.Schema({
  name: {type: String, required: true},
  status: {type: Boolean, required: true},
  date: {type: Object},
  place: { type: Object },
  members: {type: Array},
  additional: {type: String}
});

module.exports = db.model('Event', event);
