//var OpenTokLibrary = require('opentok')

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['room1','room2','room3', 'room4'];

var connections = {};

var server = require('./server');
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {

    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function(user){
        // store the username in the socket session for this client
        socket.username = user.username;
        // store the room name in the socket session for this client
        socket.room = user.group;

        if(!usernames[user.group]) {
            usernames[user.group] = {};
        }


        // add the client's username to the global list
        usernames[user.group][user.username] = user.video;
        // send client to room 1
        socket.join(user.group);
        // update list of users in chat, client-side
        io.sockets.in(socket.room).emit('updateusers', usernames[user.group]);
        io.sockets.in(socket.room).emit('updateAllHangouts', connections);
        // echo to client they've connected
//        socket.emit('updatechat', 'SERVER', 'you have connected to room1');
        // echo to room 1 that a person has connected to their room
//        socket.broadcast.to('room1').emit('updatechat', 'SERVER', user.username + ' has connected to this room');
//        socket.emit('updaterooms', rooms, 'room1');

        console.log(usernames);
    });

    socket.on('updateOneHangout', function(obj) {

        socket.session = obj.session;

        connections[obj.session] = obj.count;
        console.log('CURRENT CONNECTIONS :: ' + connections);

        io.sockets.in(socket.room).emit('updateAllHangouts', connections);

    });

    socket.on('changeHangout', function(obj) {
        connections[obj.session] = connections[obj.session] - 1;

        console.log('DISCONNECT HANGOUT :: ', connections);

        io.sockets.in(socket.room).emit('updateAllHangouts', connections);
    });

    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data) {
        // we tell the client to execute 'updatechat' with 2 parameters
        io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    });

    socket.on('switchRoom', function(newroom){
        socket.leave(socket.room);
        socket.join(newroom);
        socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
        // sent message to OLD room
        socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
        // update socket session room title
        socket.room = newroom;
        socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
        socket.emit('updaterooms', rooms, newroom);
    });


    // when the user disconnects.. perform this
    socket.on('disconnect', function(){

        if(socket.session) {
            console.log('WAS IN A SESSION')
            connections[socket.session] = connections[socket.session] - 1 ;
            io.sockets.in(socket.room).emit('updateAllHangouts', connections);
        }


        // remove the username from global usernames list
        delete usernames[socket.room][socket.username];
        // update list of users in chat, client-side
        io.sockets.in(socket.room).emit('updateusers', usernames[socket.room]);
        // echo globally that this client has left
//        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
        socket.leave(socket.room);
    });

});