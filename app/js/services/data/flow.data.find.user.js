app.service('$flowDataFindUser', function($data, $q){
    this.findUser = function(query){
       let promise = $q((resolve, reject) =>{
            $data.findUser.action(query, resp => resp.length !=0 ? resolve(resp) : reject(resp));
       });
       return  promise;
    }
});