const expect =require('expect');

const {Users} = require('./users');

describe('Users', ()=>{
    it('should add new user', ()=>{
        var tesUsers = new Users();
        var user = {
            id :'123',
            name : 'Gerry',
            room : 'Start Up'
        };
        var ngasal = tesUsers.addUser(user.id, user.name, user.room);
        expect(tesUsers.users).toEqual([user]);
    });
});