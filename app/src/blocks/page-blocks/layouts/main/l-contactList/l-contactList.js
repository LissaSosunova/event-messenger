app.controller('main.contactList', function($scope, $flowDataChats, $flowDataFindUser,
$transferService, $state, $flowDataAddUser, $flowDataUser, $postNewChat){
  let ctrl = this;
  ctrl.$onInit = _init;
  
  function _init () {
    $scope.main = $scope.main || {};
    $scope.main.newMesNotify = false;
    $scope.main.contactList = document.querySelector('.contact-list');
    let idUser = sessionStorage.getItem('id');
    if (idUser != null) refreshChats(idUser);
    let currName = sessionStorage.getItem('currname');
    $scope.main.currName = currName;
  }

  $scope.onClickContact = (id, name, event) => {
    sessionStorage.setItem('id', id);
    $scope.main.currID = id;
    $scope.main.currName = name;
    sessionStorage.setItem('currname', name);
    $transferService.setData({name: 'currName', data: name});
    event.stopPropagation();
    $flowDataChats.getDataChats({id: id})
      .then(response => {
        $transferService.setData({name: 'chats', data: response.messages});
        $transferService.setData({name: 'currID', data: id});
        $scope.main.chats = response.messages;
        let chatID = response._id;
        console.log('chat id', chatID);
        $state.go('chat', {'id': chatID});
        $flowDataUser.getDataUser()
            .then(response => {
              $scope.main.userData = response;
            });
     
  })
}

  function refreshChats(id) {
    $scope.main.currID = id;
     $flowDataChats.getDataChats({'id': id})
      .then(response => {
        $transferService.setData({name: 'chats', data: response.messages});
        $transferService.setData({name: 'currID', data: id});
        $scope.main.chats = response.messages;
        $flowDataUser.getDataUser()
        .then(response => {
          $scope.main.userData = response;
        });
      });
  }

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
    $scope.$watch(()=> {
      return $transferService.getData('newMesNotify')},
      newVal => {
        $scope.main.newMesNotify = newVal;
        console.log($transferService.getData('newMesNotify'));
      }
    )
});