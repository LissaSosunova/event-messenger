app.service('$postNewChat', function($data, $q){
  this.new_chat = function(param){
    let promise = $q((resolve, reject) =>{
      $data.new_chat.action(param, resp => resp ? resolve(resp) : reject(resp));
    });
    return  promise;
  }
});
