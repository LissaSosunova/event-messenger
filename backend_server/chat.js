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
      console.log('resp',resp);
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
        console.log('chats in user' ,updateChat);
        const findChat = await datareader(Chat, {$and:[{users: id, $or:[{users: auth.username},{email: auth.username}]}]}, 'findOne');
        if (findChat == null) {
          const data = await datareader(User, params, 'findOne');
          console.log('data', data);
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
                console.log('new chat doc was saved', saveRes);
        } 
      }
    
      const chats = await datareader(Chat, {$and:[{users: id, $or:[{users: auth.username},{email: auth.username}]}]}, 'findOne');
      res.json(chats);
    } catch (err) {
      throw new Error (err);
    }
    
//   let params = {
//     $or: [
//       {username: auth.username},
//       {email: auth.username}
//     ]
//   };
// let promise = new Promise((resolve, reject) => {
//   User.findOne(params, {chats:{$elemMatch:{id: id}}}, (e, d) => {
//     if (e) reject(e);
//     else if (d.chats == false) {
//       User.findOne({username: id}, (e, d) => {
//         if (e) throw new Error ()
//         else {
//           let chats = {};
//           chats.id = d.username;
//           chats.name = d.name;
//           chats.avatar = d.avatar;
//           User.updateOne(params, {$push: {chats: chats}}, (e, d) => {
//             if (e) throw new Error()
//             else console.log(d)
//           })
//         }
//       })
//       Chat.findOne({$and:[{users: id, $or:[{users: auth.username},{email: auth.username}]}]}, (e, d) => {
//         if (e) throw new Error()
//         else if (d == null) {
//           User.findOne(params, (error, data) => {
//             if (error) throw new Error()
//             else {
//             let myId = data.username;
//             let email = data.email;
//             let chat = new Chat;
//             chat.users.push(myId);
//             chat.users.push(id);
//             chat.email.push(email);
//             chat.type = 'private';
//             User.findOne({username: id}, (er, dt) => {
//               if (er) throw new Error()
//               else {
//                 let userEmail = dt.email;
//                   chat.email.push(userEmail);
//                   chat.save(err => {
//                     if (err) console.log(err)
//                     else {
//                       console.log("chat doc was saved");
//                       resolve();
//                     }
//                   })
//                 }
//             })
//           }
//         })
//         }
//       })
//     }
//     else {
//       resolve()
//     }
//   })
// })
// promise.then(()=>{
//   Chat.findOne({$and:[{users: id, $or:[{users: auth.username},{email: auth.username}]}]}, (error, data) => {
//     if (error) throw new Error()
//     else {
//     res.json(data);
//     }
//   })
// },
// error => {
//   throw new Error (error)
// }) 
   
})

module.exports = router;
