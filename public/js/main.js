const formMsg= document.getElementById('chat-form');
const{username,room}= Qs.parse(location.search,{
    ignoreQueryPrefix:true
})
const socket=io();
socket.emit('JoinRoom',{username,room});
socket.on('message',message=>{
    messageOutput(message);
})
formMsg.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=e.target.elements.msg.value;
    socket.emit('chatMessage', msg);
})
function messageOutput(message){
    const par=document.createElement('div');
    par.classList.add('message');
    let nam=message.username;
    let writeup=message.tex;
    let tim=message.time;
    par.innerHTML=	`<p class="meta">${nam} <span>${tim}</span></p>
    <p class="text">
       ${writeup}
    </p>`;
    document.querySelector('.chat-messages').appendChild(par);
}