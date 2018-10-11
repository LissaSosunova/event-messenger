app.controller('l-edit-profile', function($scope, $state, $flowDataUser, $transferService, $flowDataProfile){

  var ctrl = this;

  ctrl.$onInit = _onInit;
  $scope.profile = $scope.profile || {};
  function _onInit() {
    let _token = sessionStorage.getItem('token');
    $scope.readonlyremove = function (id1, id2, id3) {
      var makeEditable = document.getElementById(id1).removeAttribute('readonly');
      var invisbtnedit = document.getElementById(id2).classList.toggle('non-vis');
      var invisbtncnsl = document.getElementById(id3).classList.toggle('non-vis');
    };
    $scope.readonlyset = function (id1, id2, id3) {
      var makenotedit = document.getElementById(id1).readOnly = true;
      var invisbtnedit = document.getElementById(id2).classList.toggle('non-vis');
      var invisbtncnsl = document.getElementById(id3).classList.toggle('non-vis');
    };
    $scope.getUserDataById = params => $flowDataUser.getDataUser(params)
      .then(response => {
          $scope.profile.userData = response;
          $scope.profile.eventsAll = response.events;
          $scope.profile.userName = response.username;
          $scope.profile.avatar = response.avatar.link;
          $scope.profile.token = response.token;
          $scope.profile.email = response.email;
          $scope.profile.phone = response.phone;
          $scope.profile.nickName = response.name;
          if(response.name === 'No name'){
            document.getElementById('warning-name').classList.toggle('non-vis');
          }
        },
        error => $scope.errorMessage = error.info.message);
    $scope.getUserDataById({token: _token});

    $scope.cancelEdit = function () {
      $state.go('main');
    }
    $scope.imageStrings = [];
    $scope.processFiles = function(files){
      angular.forEach(files, function(flowFile, i){
        var fileReader = new FileReader();
        // fileReader.onload = function (event) {
        //   var uri = event.target.result;
        //   $scope.imageStrings[i] = uri;
        // };
        fileReader.readAsDataURL(flowFile.file);
      });
    };

    $scope.setNewAvatar = function (image) {
      console.log(image, $scope.imageStrings);
      let params = JSON.stringify({avatar: image});

      $flowDataProfile.requestProfile(params)
        .then(response => {
            console.log(response);
          },
          error => $scope.errorMessage = error.info.message);
    }

    $scope.setEditData = function (params) {
      console.log(params);
      $flowDataProfile.requestProfile(params)
        .then(response => {
            console.log(response);
            $state.go('main');
          },
          error => $scope.errorMessage = error.info.message);
    }


  }
});
