app.controller('main.contactList', function($scope, $flowDataChats, $flowDataFindUser,
$transferService, $state, $flowDataAddUser, $flowDataUser, $timeout){
  let ctrl = this;
  ctrl.$onInit = _init;

  function _init () {
    $scope.main = $scope.main || {};
    $scope.main.contactList = document.querySelector('.contact-list');
    $scope.main.currID = $transferService.getData('currID');
  }

  $scope.onClickContact = function (id, event) {
    $state.go('chat', {'id': id});
    $transferService.setData({name: 'currID', data: id});
    event.stopPropagation();
    $flowDataChats.getDataChats({id: id})
      .then(function(response){
        $transferService.setData({name: 'chats', data: response.messages});
      });
    return id;
  };

  $('.tabs-nav li').click(function(event){
    event.preventDefault();
    let id = $(this).children('a').attr('href');
	  $('.tab').removeClass('is-vis-tab');
	  $('.tabs-nav li').removeClass('curr-tab');
	  $(this).addClass('curr-tab');
    $(id).addClass('is-vis-tab');
  })

  $scope.searchContact = item => {
    $flowDataFindUser.findUser(item)
      .then(response => {
        $scope.searchRes = response;
        $scope.errMes = "";
      }, error => {
        $scope.searchRes = error;
          $scope.errMes = "Nothing found";
      });
    
  }

  $scope.addContact = index => {
    let userObj = {}
    let id = $scope.searchRes[index].username;
    let name = $scope.searchRes[index].name;
    let avatar = $scope.searchRes[index].avatar;
    userObj.id = id;
    userObj.name = name;
    userObj.avatar = avatar;
  
    $flowDataAddUser.addUser(userObj)
      .then(response => {
        $flowDataUser.getDataUser()
        .then(response => {
        $scope.main.userData = response;
        });
      })
  }
   
  $scope.$watch('main.userData', function(newVal){
      if (!$scope.main.userData) {
        return
      }
      else {
        $scope.main.dataUser = newVal;
      }
    });
});
