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
    // pake mustache templating
    var formattedTime = moment(chat.createdAt).format('h:mm a')
    
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: chat.text,
        from: chat.from,
        createdAt: formattedTime
    });
    
    jQuery('#messages').append(html);
    
    /*console.log('Pesan baru', chat);
    var formattedTime = moment(chat.createdAt).format('h:mm a')
    var li = jQuery('<li></li>');
    li.text(`${chat.from} ${formattedTime}: ${chat.text}`);
    jQuery('#messages').append(li);*/
});

socket.on('newLocationMessage', function(location){
    // pake mustache
    var formattedTime = moment(location.createdAt).format('h:mm a')
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        url: location.url,
        from: location.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    
    /*var li = jQuery('<li></li>');
    var link = jQuery(`<a target="_blank">My Current Location</a>`)
    var formattedTime = moment(location.createdAt).format('h:mm a')
    
    li.text(`${location.from} ${formattedTime}: `);
    link.attr('href', location.url);
    li.append(link);
    jQuery('#messages').append(li);*/
});

socket.on('disconnect', function(){
    console.log('Disonnected from the server');
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    
    var messageTextbox = jQuery('[name=message]');
    
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    },function(){
        messageTextbox.val('') // clear input text
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }
    
    locationButton.attr('disabled', 'disabled');
    //locationButton.attr('disabled', 'disabled').text('sending');
    
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled');
        socket.emit('createLocationMessage', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        });
    }, function(){
        locationButton.removeAttr('disabled');
        alert('Unable to fetch location.');
    });
});