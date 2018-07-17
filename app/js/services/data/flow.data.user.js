app.service('$flowDataUser', function($data, $q){
    this.getDataUser = function(){
       let promise = $q((resolve, reject) =>{
            $data.main.action(null, resp =>  resp ? resolve(resp) : reject(resp));
       });
       return  promise;
    }
});
