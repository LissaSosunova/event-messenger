app.controller('main.contactList', function($scope, $flowDataChats, $flowDataFindUser,
$transferService, $state, $flowDataAddUser, $flowDataUser){
  let ctrl = this;
  ctrl.$onInit = _init;

  function _init () {
    $scope.main = $scope.main || {};
    $scope.main.contactList = document.querySelector('.contact-list');
  }

  $scope.onClickContact = (id, event) => {
    $state.go('chat', {'id': id});
    $scope.main.currID = id;
    event.stopPropagation();
    $flowDataChats.getDataChats({id: id})
      .then(response => {
        $transferService.setData({name: 'chats', data: response});
        $transferService.setData({name: 'currID', data: id});
        $scope.main.chats = response;
        $flowDataUser.getDataUser()
        .then(response => {
          $scope.main.userData = response;
        });
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
        $scope.main.querySearch = [];
        console.log($scope.main);
        $scope.main.querySearch = $scope.searchRes.filter(item => {
          let push = true;
          if (item.username == $scope.main.dataUser.username) push = false;
          $scope.main.dataUser.contacts.forEach(element => {
            if(item.username == element.id || item.username == $scope.main.dataUser.username) {
              push = false;
              return
              } 
          })
          if (push) return item
        })
        $scope.errMes = "";
        if ($scope.main.querySearch == false) $scope.errMes = "Nothing found"
      }, error => {
        $scope.main.querySearch = error;
          $scope.errMes = "Nothing found";
      }); 
  }

  $scope.addContact = index => {
    let userObj = {}
    let id = $scope.main.querySearch[index].username;
    let name = $scope.main.querySearch[index].name;
    let avatar = $scope.main.querySearch[index].avatar;
    userObj.id = id;
    userObj.name = name;
    userObj.avatar = avatar;
    $scope.main.querySearch.splice(index, 1);
    
    $flowDataAddUser.addUser(userObj)
      .then(response => {
        $flowDataUser.getDataUser()
        .then(response => {
        $scope.main.userData = response;
        });
      })
  }
   
  $scope.$watch('main.userData', newVal => {
      if (!$scope.main.userData) {
        return
      }
      else {
        $scope.main.dataUser = newVal;
      }
    });
});
