const path=require('path');
const http=require('http');
const moment=require('moment');
const express= require('express');
const socketio=require('socket.io');
const {userJoin,getCurrentUser,userLeaves}=require("C:\\chat application\\public\\js\\utils\\users.js");
class chatDetails{
    constructor(name,text){
        this.username=name;
        this.tex=text;
        this.time=moment().format('h:mm a');
    }
}

const app = express();
const server=http.createServer(app);
const io= socketio(server);
app.use(express.static(path.join(__dirname,'public')));
io.on('connection',socket=>{
    socket.on('JoinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);
        socket.join(user.room);
        socket.emit('message',new chatDetails('ChatBot',`Welcome ${user.name}`));
        socket.broadcast.to(user.room).emit('message',new chatDetails('ChatBot',`${user.name} has joined the chat`));
    });
   
   
    socket.on('chatMessage',(msg)=>{
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',new chatDetails(user.name,msg));
    })
    socket.on('disconnect',()=>{
        const user=userLeaves(socket.id);
        if(user){
        io.to(user.room).emit('message',new chatDetails('ChatBot',`${user.name} has left the chat`));
        }
    })
})
const PORT=3000||process.env.PORT;
server.listen(PORT,()=>console.log('Server running on port 3000'));
