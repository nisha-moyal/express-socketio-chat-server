const exress = require('express');
const { Server } = require('socket.io');
const { join } = require('node:path');
const http = require('http');

const app = exress();

// Attach the express server to the socket.io server
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    
    // create and join room
    socket.on('create_grp', (roomId) => {
        socket.join(roomId);
        console.log(`${socket.id} created and joined room ${roomId}`);
        socket.emit('room_joined', roomId);
    });

    // join room
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);
        socket.emit('room_joined', roomId);
    });

    // send message
    socket.on('grp_message', ({roomId, message}) => {
        console.log('message: ' + message);

        socket.to(roomId).emit('serv_grp_message', message);
    });

    // leave room
    socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        console.log(`${socket.id} left room ${roomId}`);
    });

    // socket.on('chat message', (msg) => {
    //     io.emit('chat message', msg);
    //   });

    // socket.on('chat message', (msg) => {
    //   console.log('message: ' + msg);
    // });
  });

app.use(exress.json());



app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });

const port = 3001;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});