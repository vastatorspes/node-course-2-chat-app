[{
    id:'',
    name: 'Gerry',
    room: 'Start Up'
}]

class Users{
    constructor(){
        this.users = [];
    }
    // addUser(id, name, room)
    addUser(id, name, room){
        var user = {id, name, room}; // id = id => karna nama sama udh otomatis 
        this.users.push(user);
        return user;
    }
    // removeUser(id)
    removeUser(id){
        var users = this.getUser(id);
        
        if(users){
            this.users = this.users.filter((user) => user.id != id);
        }
        return users;
    }
    getUser(id){
        // getUser(id)
        // filter ngasilin array
        return this.users.filter((user) => user.id === id)[0];
    }
    getUserList(room){
        // getUserList(room)
        var users = this.users.filter((user) => user.room === room);
        var namesArray = users.map((user) => user.name);
        return namesArray;
    }
}

module.exports = {Users};

// ES6 Class syntax
/*class Person {
    // constructor function otomatis kepanggil.. namanya harus constructor
    // kayak init di python
    constructor(name, age){
        this.name = name;
        this.age = age;
    }
    
    getUserDescription(){
        return `${this.name} is ${this.age} year(s) old.`
    }
}
var me = new Person("Gerry", 22);
console.log(me.getUserDescription());*/