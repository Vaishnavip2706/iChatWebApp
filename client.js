const socket = io('http://192.168.86.5:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
let typingTimeout;
var audio = new Audio('ringtone.mp3');
const typingElement = document.getElementById('typing-indicator');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message')
    messageElement.classList.add(position);

    // Message text span
    const messageText = document.createElement('span');
    messageText.classList.add('message-text');
    messageText.innerText = message + ' ';

   //create timespan
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('timestamp');
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timeSpan.innerText = `(${timeString})`;

    // Append message and timestamp spans
    messageElement.appendChild(messageText);
    messageElement.appendChild(timeSpan);

    // Insert into container 
    if (messageContainer.contains(typingElement)) {
        messageContainer.insertBefore(messageElement, typingElement);
    } else {
        messageContainer.appendChild(messageElement);
    }

    if (position === 'left') audio.play();

    // Scroll to bottom
    messageContainer.scrollTop = messageContainer.scrollHeight;
};

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value='';
})

let name ='';
while(!name|| name.trim() === ''){
name = prompt("Enter Your Name To Join");
}
name = name.trim();
socket.emit('new-user-joined',name);

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

socket.on('receive', data => {
    append(`${data.name}:${data.message}`, 'left');
});
socket.on('left', name => {
    append(`${name} left the chat`, 'left');
});

//Typing indicator
messageInput.addEventListener('input',()=>{
     console.log('Typing event emitted');
    socket.emit('typing')
    clearTimeout(typingTimeout);
    typingTimeout= setTimeout(()=>{
        socket.emit('stoptyping');
    }, 1000);
});


//showing typing message
socket.on('displayTyping', name=>{
    typingElement.innerText= `${name} is typing..`;
});

//hide typing message
socket.on('hideTyping',()=>{
      typingElement.innerText= '';
});

