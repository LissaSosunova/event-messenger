app.service('$changeNotificationStatus', function($data, $q){
  this.change_status = function(param){
    let promise = $q((resolve, reject) =>{
      $data.change_status.action(param, resp => resp ? resolve(resp) : reject(resp));
    });
    return  promise;
  }
});
