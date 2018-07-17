var mongoose = require('mongoose')
var db_url = process.env.MONGODB_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/eventmessenger-users'
mongoose.connect(db_url, function(){
    console.log('MongoDB connected sucessfully')
})

module.exports = mongoose
