const router = require('express').Router()
const jwt = require('jwt-simple');
const url = require('url');
const queryString = require('querystring')
const config = require('./config');
const User = require('./models/user');
const Chat = require('./models/chats');
const datareader = require('./datareader');

router.get('/chat/', async function (req, res, next){
  const param = url.parse(req.url).query;
  const id = queryString.parse(param).id;
  let auth;
    try {
    auth = jwt.decode(req.headers['authorization'], config.secretkey);
  } catch (err) {
    return res.sendStatus(401)
  }

    const params = {
      $or: [
        {username: auth.username},
        {email: auth.username}
      ]
    };
  
    try {
      const queryParams = {
        query: {
          $or: [
            {username: auth.username},
            {email: auth.username}
          ]
        },
        elementMatch: {chats:{$elemMatch:{id: id}}}
      };
      const resp = await datareader(User, queryParams, 'findOneElementMatch');
      if (resp.chats == false) {
        const response = await datareader(User, {username: id}, 'findOne');
        const chats = {};
        chats.id = response.username;
        chats.name = response.name;
        chats.avatar = response.avatar;
        const updateParams = {
          query: params, 
          objNew:  {$push: {chats: chats}}};
        const updateChat = await datareader(User, updateParams, 'updateOne');
        const findChat = await datareader(Chat, {$and:[{users: id, $or:[{users: auth.username},{email: auth.username}]}]}, 'findOne');
        if (findChat == null) {
          const data = await datareader(User, params, 'findOne');
          const myId = data.username;
                const email = data.email;
                const chat = new Chat;
                chat.users.push(myId);
                chat.users.push(id);
                chat.email.push(email);
                chat.type = 'private';
                const user = await datareader(User, {username: id}, 'findOne');
                const userEmail = user.email;
                chat.email.push(userEmail);
                const saveRes = await datareader(chat, null, 'save');
        } 
      }
    
      const chats = await datareader(Chat, {$and:[{users: id, $or:[{users: auth.username},{email: auth.username}]}]}, 'findOne');
      res.json(chats);
    } catch (err) {
      throw new Error (err);
    }
})

module.exports = router;