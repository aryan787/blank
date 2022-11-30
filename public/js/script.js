let socket = io();
let userName = '';
let myId = '';
let status = true;



function basicDetails() {
    const userData = JSON.parse(localStorage.getItem('roomObject'));
    if(!userData) {
        location.href = '/';
        return;
    }
    userName = userData.userName;
    localStorage.removeItem('roomObject');
    userTemplate(userName);
    const newUserDetails = {
        name: userName,
    };
    welcomeMessageTemplate(userName);
    socket.emit('newUser', newUserDetails);
}

function sendMessage() {
    debugger
    const message = document.getElementById('message').value;
    if(!message) {
        return;
    }
    document.getElementById('message').value = '';
    const messageObj = {
        name: userName,
        message
    };
    socket.emit('newMessage', messageObj);
    messageTemplate(messageObj, 'ownMessaage');
    scrollToView();
}

function sendLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
        const messageObj = {
            name: userName,
            time: moment(new Date().getTime()).format('LT'),
            link: `http://google.com/maps/?q=${position.coords.latitude},${position.coords.longitude}`
        };

        socket.emit('newMessage', messageObj);
        messageTemplate(messageObj, 'ownMessaage');
    });
}

function leaveChat() {
    const payload = {
        removeId: myId,
        name: userName
    }
    status = false;
    socket.emit('leaveConversation', payload);
    removeEveryThing(['leaveBtn', 'footer']);
    userLeaveTemplate({name: 'You'});
    scrollToView();
}

function scrollToView() {
    const view = document.getElementById('messages').lastElementChild;
    view.scrollIntoView();
}

// Listeners

socket.on('newUser', (newUserName) => {
    newUserTemplate(newUserName);
});

socket.on('newMessage', (newMessage) => {
    if(status)
        messageTemplate(newMessage);
});

socket.on('getConnectedUsers', (userList) => {
    userList.users.forEach((element, idx) => {
        addPeapletoSideNav(element, idx);
    });
    myId = userList.id + userName
});

socket.on('userLeft', (userName) => {
    userLeaveTemplate(userName);
});


// Templates

function userTemplate(name) {
    const p = document.createElement("p");
    p.innerHTML = name;
    document.getElementById('OwnDetails').appendChild(p);
}

function messageTemplate(messageData, className) {
    const time = moment(new Date().getTime()).format('LT');

    var div = document.createElement("div");
    div.setAttribute('class', 'messageBody');

    if(className) {
        div.setAttribute('class', className);
    }

    var p = document.createElement("p");
    p.setAttribute('class', 'user');
    p.innerHTML = messageData.name

    var span = document.createElement("span");
    span.innerHTML = time

    p.appendChild(span);

    var messageBody;

    if(messageData.link) {
        messageBody = document.createElement("a");
        messageBody.setAttribute('target', '_blanck');
        messageBody.setAttribute('href', messageData.link);
        messageBody.innerHTML = `My Location`
    } else {
        messageBody = document.createElement("h4");
        messageBody.innerHTML = messageData.message;
    }
    messageBody.setAttribute('class', 'userMessage');

    div.appendChild(p);
    div.appendChild(messageBody);
    document.getElementsByClassName('messages')[0].appendChild(div);

}


function newUserTemplate(userData) {
    const time = moment(new Date().getTime()).format('LT');
    var p = document.createElement('p');
    p.setAttribute('class', 'newUser');
    p.innerHTML = `${userData.name} has joined this conversation at ${time}`;
    document.getElementsByClassName('messages')[0].appendChild(p);

    addPeapletoSideNav(userData.name, userData.id);
    scrollToView
}

function userLeaveTemplate(userObject) {
    const time = moment(new Date().getTime()).format('LT');
    var p = document.createElement('p');
    p.setAttribute('class', 'newUser');
    p.setAttribute('id', 'userLeft');
    p.innerHTML = `${userObject.name} left this conversation at ${time}`;
    document.getElementsByClassName('messages')[0].appendChild(p);
    removeNode(userObject.id);
}

function welcomeMessageTemplate(name) {
    var p = document.createElement('p');
    p.setAttribute('class', 'newUser');
    p.innerHTML = `Welcome to the chat Application ${name}`;
    document.getElementsByClassName('messages')[0].appendChild(p);
}


function addPeapletoSideNav(name, id) {
    const li = document.createElement('li');
    li.setAttribute('id', `${id}${name}`);
    li.innerHTML = name;
    document.getElementById('userList').appendChild(li);
}

function removeNode(id) {
    var elem = document.getElementById(id);
    if(elem) {
        elem.parentNode.removeChild(elem);
    }

}

function removeEveryThing(list) {
    list.forEach(element => {
        removeNode(element);
    });
}