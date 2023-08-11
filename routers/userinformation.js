const express = require('express');
const user = require('../controller/userinformation')
const userrouter = express.Router()
const conversation = require('../controller/conversation')

// create/add user to database
userrouter.post('/',user.createuser)
userrouter.post('/login',user.verifyuser)
userrouter.get('/getloginuser/:token' , user.getloginuser)
userrouter.get('/getallusersexceptloginuser/:token' , user.getallusersexceptloginuser)
userrouter.get('/getuserwhichisclick/:id' , user.getuserwhichisclick)
userrouter.post('/addconversations',conversation.addconversations)
userrouter.get('/getallconversations/:sender_id/:receiver_id',conversation.getallconversations)
userrouter.get('/getlatestconversations/:sender_id/:receiver_id',conversation.getlatestconversations)


exports.userrouter = userrouter