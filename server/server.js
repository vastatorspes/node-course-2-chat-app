const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000; 
var app = express();

// bikin server
var server = http.createServer(app);
// bikin web socket server
var io = socketIO(server);

//middleware buat arahin static web ada di folder public
app.use(express.static(publicPath));

// on => listen
// emit => send

// io.on buat register event listener dan lakuin sesuatu waktu event terjadi
// connection argumen = build in event buat listen ke new connection (client konek ke server)
io.on('connection', (socket) => {
    console.log('new user connected');
    
    // buat user yang baru join
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    
    // user lain liat ada yg baru join
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
    
    socket.on('createMessage', (message, callback) =>{
        console.log('New chat', message);
        
        io.emit('newMessage', generateMessage(message.from, message.text));
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
        io.emit('newLocationMessage', generateLocationMessage('User', coords.latitude, coords.longitude));
    });
    
    
    // ini kalo browser / client ditutup
    socket.on('disconnect', () =>{
        console.log('Disonnected from the server') 
    });
    
});

server.listen(port, ()=> {
    console.log('server is running on port ' + port);
});

