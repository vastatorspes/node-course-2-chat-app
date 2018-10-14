// io is a method available to us becoz we alr loaded in the socket.io.js library
// waktu kita call function ini, kita initiating the request
// bikin request dari client ke server buat buka web socket dan terus buka koneksinya
// variable socket ini yang bakal listen data sama kirim data ke server        
var socket = io();

// arrow function mungkin ga jalan di mobile phone ato web browser lain. jadi pake function biasa
/*socket.on('connect', (mauisiapabebas)=>{
    console.log('Connected to the server') 
});
*/

// on => listen
// emit => send

// on method sama dengan yang dipake di server.js
socket.on('connect', function(){
    console.log('Connected to the server');
});

socket.on('newMessage', function(chat){
    console.log('Pesan baru', chat);
});

socket.on('disconnect', function(){
    console.log('Disonnected from the server');
});
