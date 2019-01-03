app.service('$flowDataDeleteChat', function($data, $q){
    this.deleteChat = function(query){
       let promise = $q((resolve, reject) =>{
            $data.deleteChat.action(query, resp => resp ? resolve(resp) : reject(resp));
       });
       return  promise;
    }
});