// buat test function

var expect = require('expect');

var {generateMessage,generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('Should generate correct message object', () =>{
        var from = 'ger';
        var text = 'some text';
        
        var message = generateMessage(from, text);
        expect(typeof(message.createdAt)).toBe('number');
        expect(message).toMatchObject({from, text});
    });
});

describe('generateLocationMessage', () => {
    it('Should generate correct location object', () =>{
        var from = 'ger';
        var lat = 1;
        var lng = 1;
        var url = `https://www.google.com/maps?q=${lat},${lng}`;
        
        var location = generateLocationMessage(from, lat, lng);
        expect(typeof(location.createdAt)).toBe('number');
        expect(location).toMatchObject({from, url});
    });
});