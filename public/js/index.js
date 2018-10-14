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

// waktu ada pesan masuk
socket.on('newMessage', function(chat){
    console.log('Pesan baru', chat);
    
    var li = jQuery('<li></li>');
    li.text(`${chat.from}: ${chat.text}`);
    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(location){
    var li = jQuery('<li></li>');
    var link = jQuery(`<a target="_blank">My Current Location</a>`)
    
    li.text(`${location.from}: `);
    link.attr('href', location.url);
    li.append(link);
    jQuery('#messages').append(li);
});

socket.on('disconnect', function(){
    console.log('Disonnected from the server');
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    
    socket.emit('createMessage', {
        from: 'jquery',
        text: jQuery('[name=message]').val()
    },function(){
        
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }
    
    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        });
    }, function(){
        alert('Unable to fetch location.');
    });
});