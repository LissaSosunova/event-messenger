app.controller('main.contactList', function($scope, $flowDataChats, $transferService, $state, $timeout){
  let ctrl = this;
  ctrl.$onInit = _init;

  function _init () {
    $scope.main = $scope.main || {};
    $scope.main.contactList = document.querySelector('.contact-list');
  }

  $scope.onClickContact = function (id, event) {
    $state.go('chat', {'id': id});
    $scope.main.currID = id;
    event.stopPropagation();
    $flowDataChats.getDataChats({id: id})
      .then(function(response){
        $transferService.setData({name: 'chats', data: response.messages});
      });
    return id;
  };
  $scope.$watch('main.userData', function(newVal){
      if (!$scope.main.userData) {
        return
      }
      else {
        $scope.main.dataUser = newVal;
        $scope.main.chatId = $scope.main.dataUser.chats[0];
      }
    });
});
