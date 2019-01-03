app.service('$flowDataDeleteContact', function($data, $q){
    this.deleteContact = function(query){
       let promise = $q((resolve, reject) =>{
            $data.deleteContact.action(query, resp => resp ? resolve(resp) : reject(resp));
       });
       return  promise;
    }
});