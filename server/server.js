(function() {
    const path = require('path');
    const http = require('http');
    const express = require('express');
    const socketIO = require('socket.io');
    const PORT = process.env.port || 4200;
    const publicPath = path.join(__dirname , '/../public');

    let app = express();
    let server = http.createServer(app);
    let io = socketIO(server);

    const users = [];

    const rooms = [];

    app.use(express.static(publicPath));


    io.on('connection', (socket) => {

        socket.on('newUser', (newUserData) => {
            users.push(newUserData.name);
            newUserData['id'] = users.length - 1;
            socket.broadcast.emit('newUser', newUserData);
            socket.emit('getConnectedUsers', {users, id: newUserData.id});
        });

        socket.on('newMessage', (msgObject) => {
            socket.broadcast.emit('newMessage', msgObject);
        });

        socket.on('leaveConversation', (payload) => {
            users.forEach((element, index) => {
                if(element === payload.name) {
                    users.splice(index, 1);
                }
            });
            socket.broadcast.emit('userLeft', {
                name: payload.name,
                id: payload.removeId
            });
        });

        socket.on('checkRoomDetails', (payload) => {
            let status = true;
            if(payload.roomName !== 'blue' || payload.roomId !== 'blue@7Dui') {
                status = false
            }

            socket.emit('roomStatus', status);
        })


        socket.on('disconnect', () => {
            console.log('User was Disconnected !!');
        });
    });


    server.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });

    function createMessage(msgObj) {
        this.message = msgObj.message;
        this.from = msgObj.from;
        this.createdAt = new Date().getTime();
    }

} ());

