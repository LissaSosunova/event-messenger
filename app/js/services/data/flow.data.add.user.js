app.service('$flowDataAddUser', function($data, $q){
    this.addUser = function(query){
       let promise = $q((resolve, reject) =>{
            $data.addUser.action(query, resp => resp ? resolve(resp) : reject(resp));
       });
       return  promise;
    }
});