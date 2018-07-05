app.service('$token', function(){
  let self = this;
  this.getToken = getToken;
  function getToken(){
    return sessionStorage.getItem("token");
  }
});
