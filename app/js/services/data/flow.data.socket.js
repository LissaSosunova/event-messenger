app.service('$socket', function($getSocket, $window, $transferService){

    let socket = new WebSocket($getSocket.getURI());
    this.sendMesSocket = function (sender){
        let messageBody = JSON.stringify(sender);
        socket.send(messageBody);
    }
    this.sendSocket = function(sender) {
        let messageBody = JSON.stringify(sender);
        socket.send(messageBody);
    }
    this.incomingMessageHandler = function () {
        socket.onmessage = function (event) {
            let incomingMessage = event.data;
            let newMes = JSON.parse(incomingMessage);
            if (newMes.read) {
                $transferService.setData({name: 'incomingMessage', data: newMes});
            }
            else if (!newMes.read) {
                console.log('newMesNotify');
                $transferService.setData({name: 'newMesNotify', data: true});
            }
            else if (newMes.notification) {
                console.log('true', newMes.notification);
                $transferService.setData({name: 'notify', data: true});
            }
            else if (!newMes.notification) {
                console.log('false', newMes.notification);
                $transferService.setData({name: 'notify', data: false});
            }
        }     
    }
    this.socket = function () {
        return socket;
    }
})