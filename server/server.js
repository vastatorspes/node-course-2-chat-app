const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000; 
var app = express();

// bikin server
var server = http.createServer(app);
// bikin web socket server
var io = socketIO(server);
var users = new Users();

//middleware buat arahin static web ada di folder public
app.use(express.static(publicPath));

// on => listen
// emit => send

// io.on buat register event listener dan lakuin sesuatu waktu event terjadi
// connection argumen = build in event buat listen ke new connection (client konek ke server)
io.on('connection', (socket) => {
    console.log('new user connected');
    
    // terima even join
    socket.on('join', (params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required.');
        }
        // join room dengan nama tersebut
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        
        // io.emit -> io.to(params.room).emit
        // socket.broadcast -> socket.broadcast.to(params.room).emit
        // socket.emit -> socket.to(params.room).emit
        
        io.to(params.room).emit('updateUserList', users.getUserList(params.room))
        // buat user yang baru join
        socket.emit('newMessage', generateMessage('Admin', `Welcome to the ${params.room} room.`));
        // user lain liat ada yg baru join
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        callback(); // kalo bener gausah kasih callback soalnya callback buat error aja
    });
    
    socket.on('createMessage', (message, callback) =>{
        var user = users.getUser(socket.id);
        
        //check if the user exists
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        callback();
        //cara cara kirim message ke console
        // #region
//------------------------------------------------//
        // 1. socket.emit cuma emit event ke single connection (diri sendiri)
        /*socket.emit('newMessage', {
            from: 'she',
            text: 'whats up',
            createdAt: 0
        });*/
//------------------------------------------------//
        
//------------------------------------------------//
        // 2. io.emit emit event ke semua connection
        /*io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });*/
//------------------------------------------------//
        
        // 3. send message ke semuanya kecuali ini
        /*socket.broadcast.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });*/
        // #endregion 
    });
    
    socket.on('createLocationMessage', (coords) => {
        //io.emit('newMessage', generateMessage('Admin', `${coords.latitude}, ${coords.longitude}`))
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });
    
    
    // ini kalo browser / client ditutup
    socket.on('disconnect', () =>{
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
    
});

server.listen(port, ()=> {
    console.log('server is running on port ' + port);
});

