let socket = new WebSocket("ws://localhost:8081");

window.onload = function() {
    document.forms.publish.onsubmit = function() {
        let outgoingMessage = this.message.value;
        
        socket.send(outgoingMessage);
        return false;
    };
      
    socket.onmessage = function(event) {
        let incomingMessage = event.data;
        
        showMessage(incomingMessage);
    };
}

function showMessage(message) {
    let messageElem = document.createElement('div');

    messageElem.appendChild(document.createTextNode(message));
    document.getElementById('subscribe').appendChild(messageElem);
}