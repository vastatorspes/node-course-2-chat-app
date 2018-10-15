// buat test function

var expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('Should reject non-string values', () =>{
        var res = isRealString(123);
        expect(res).toBe(false);
    });    
    it('Should reject string with only spaces', () =>{
        var res = isRealString('     ');
        expect(res).toBe(false);
    });
    it('Should allaow string with non space character', () =>{
        var res = isRealString('da');
        expect(res).toBe(true);
    });
});