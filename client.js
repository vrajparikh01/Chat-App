const socket = io('http://localhost:5000');

// Get DOM elements into JS variables
const msgContainer = document.querySelector('.container');
const form = document.getElementById('send-container');
const msgInput = document.getElementById('msgInp');

const name = prompt("Enter your name to join chat");
socket.emit('new-user-joined',name);

var audio = new Audio("Images/sound.mp3");

// Fn which will append event info to the container
const append = (message,position)=>{
    const msgElement = document.createElement('div');
    msgElement.innerText = message;
    msgElement.classList.add('message');
    msgElement.classList.add(position);
    msgContainer.append(msgElement);
    if(position == 'left'){
        audio.play();
    }
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();    // It will prevent the page from reloading
    const message = msgInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    msgInput.value = '';
})

// If new user joins, let the server know 
// client.js accepts the event from the node server (i.e. index.js)
socket.on('user-joined', name=>{
    append(`${name} joined the chat`, 'right');
});

// Object receives the information in the form of data
socket.on('receive', data=>{
    append(`${data.name}: ${data.message}`, 'left');
});

// If osomeone leaves the chat
socket.on('leave', name=>{
    append(`${name} left the chat`, 'right');
});