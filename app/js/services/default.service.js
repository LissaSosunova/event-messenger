app.service('$defaultService', function($default){
    let self = this;
    this.getURI = getURI;
    function getURI(){
        return $default.protocol + "://" + $default.host + ":" + $default.port;
    }
});
app.service('$getSocket', function($defaultWebSocket){
    let self = this;
    this.getURI = getURI;
    function getURI(){
        return $defaultWebSocket.protocol + "://" + $defaultWebSocket.host + ":" + $defaultWebSocket.port;
    }
})