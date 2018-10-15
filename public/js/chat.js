// io is a method available to us becoz we alr loaded in the socket.io.js library
// waktu kita call function ini, kita initiating the request
// bikin request dari client ke server buat buka web socket dan terus buka koneksinya
// variable socket ini yang bakal listen data sama kirim data ke server        
var socket = io();

// arrow function mungkin ga jalan di mobile phone ato web browser lain. jadi pake function biasa

function scrollToBottom(){
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight + 100 >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
};

// on => listen
// emit => send

// on method sama dengan yang dipake di server.js
socket.on('connect', function(){
    console.log('Connected to the server');
    var params = jQuery.deparam(window.location.search);
    
    // emit event join
    socket.emit('join', params, function(err){ /*ini pass emit dia nunggu callback, kalo dpt callback berarti error*/
        if(err){
            alert(err);
            window.location.href = '/';
        }else{
        }
    });
});

socket.on('disconnect', function(){
    console.log('Disonnected from the server');
});

socket.on('updateUserList', function(users){
    var ol = jQuery('<ol></ol>');
    
    users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user)) 
    });
    jQuery('#users').html(ol);
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
    scrollToBottom();
    
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
    scrollToBottom();
    
    /*var li = jQuery('<li></li>');
    var link = jQuery(`<a target="_blank">My Current Location</a>`)
    var formattedTime = moment(location.createdAt).format('h:mm a')
    
    li.text(`${location.from} ${formattedTime}: `);
    link.attr('href', location.url);
    li.append(link);
    jQuery('#messages').append(li);*/
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