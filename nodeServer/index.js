// Node server which will handle socket io connections
const io = require('socket.io')(5000, {
    cors: {
      origin: '*',
    }
  });

const users = {};

// Socket is a particular connection 
// io.on is a socket.io instance and listen many incoming socket events
// whenever there is a connection, run the arrow function
io.on('connection',socket=>{
    // socket.on will handle what will happen with the particular connection
    // i.e. it accepts an event
    // When socket.on will have a new user, it will run the callback fn
    socket.on('new-user-joined', name=>{
        // console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends the message, broadcast it to other people
    socket.on('send', message=>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    // when user left the chat
    socket.on('disconnect', message=>{
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    });
})