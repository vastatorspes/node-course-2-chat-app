const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

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
// lalu lakuin sesuatu waktu ada connection
io.on('connection', (socket) => {
    console.log('new user connected');
    
    // creating the event
    // argumen pertama nama event, argumen kedua terserah.. disini object

    socket.emit('newMessage', {
        from: 'she',
        text: 'whats up',
        createdAt: 0
    })
    
    socket.on('createMessage', (message) =>{
        console.log('New chat', message);
    })
    
    
    // ini kalo browser / client ditutup
    socket.on('disconnect', () =>{
        console.log('Disonnected from the server') 
    });
    
});

server.listen(port, ()=> {
    console.log('server is running on port ' + port);
});

