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

// io.on buat register event listener dan lakuin sesuatu waktu event terjadi
// event yang mau kita pake connection buat listen ke new connection (client konek ke server)
// lalu lakuin sesuatu waktu ada connection
io.on('connection', (socket) => {
    console.log('new user connected');
    
    // ini kalo browser / client ditutup
    socket.on('disconnect', (terserah) =>{
        console.log('Disonnected from the server') 
    });
});

server.listen(port, ()=> {
    console.log('server is running on port ' + port);
});

