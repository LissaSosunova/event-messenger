app.controller('l-registration', function($scope, $state, $flowDataRegistr, $timeout, $transferService){
  $scope.loginPage = {
    logotype: "app/img/main/logo_login_page.png"
  };
  let loginForm = document.getElementById('hide-form');
  $scope.setReg = function (params) {
    if(params.password !== params.passwordConf){
      openModalMessage("You should to enter same password");
    } else {
      $flowDataRegistr.requestRegistr(params)
        .then(response => {
            if(response.name !== 'MongoError'){
              $scope.message = "You created new user. Go to login page and use your login: " + params.username;
              loginForm.classList.toggle('non-vis');
              $timeout(function(){
                $state.go('login');
              }, 3000);
            } else if(response.name === 'MongoError'){
              console.log(response);
              $scope.message = "No for " + params.username;
              openModalMessage("User with this ID " + params.username +" or e-mail " +params.email +" is already exit. Try again.");
            }
          },
          error => $scope.message = error);
    }
  };

  let regExp =/([^@\s\]\\,\\;\\:\\%\\~\\`\\!\\?\\<\\>\\$\\#\\^\\&\\*\\(\\)\\/\\+\\"\\'\\=])$/;

  let getKeyboardEventResult = function (id) {
    $scope.checkedItem = angular.element(document.querySelector("#"+id));
    if (!regExp.test($scope.checkedItem.val())) {
      $scope.checkedItem.val($scope.checkedItem.val().substr(0, $scope.checkedItem.val().length - 1));
    }
  };
  $scope.onKeyUp = function (id) {
    getKeyboardEventResult(id);
  };
  //Modal message function
  function openModalMessage(mess) {
    var modal = document.getElementById('myModal');
    var span = document.getElementsByClassName("btn-close")[0];
    $scope.errorMessage = mess;
    modal.style.display = "block";
    $scope.closePopup = function() {
      modal.style.display = "none";
    };
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }
});