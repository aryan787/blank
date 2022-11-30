let socket = io();



function createNewRoom() {
    let payload = {
        roomName: document.getElementById('newRoomName').value,
        userName: document.getElementById('userNameForNewRoom').value,
    }
    socket.emit('createRoom', payload);
    if(!payload.roomName.trim() || !payload.userName.trim()) {
        alert('Invalid Filed Data');
        return;
    }
    localStorage.setItem('newRoomPayload', roomName);
    window.location.href = '/chat.html';
}

function joinRoom() {
    const payload = {
        roomName : document.getElementById('existingRoomName').value,
        roomId : document.getElementById('roomId').value,
        userName: document.getElementById('userName').value,
    };

    if(!payload.roomName.trim() || !payload.roomId.trim() || !payload.userName.trim()) {
        alert('Invalid Filed Data');
        return;
    }

    socket.emit('checkRoomDetails', payload);
    socket.on('roomStatus', (status) => {
        if(!status) {
            alert('Incorrect Room Details');
        } else {
            localStorage.setItem('roomObject', JSON.stringify(payload));
            window.location.href = '/chat.html';
        }
    })
}