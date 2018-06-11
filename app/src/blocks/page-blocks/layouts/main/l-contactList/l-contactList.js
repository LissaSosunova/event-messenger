app.controller('main.contactList', function($scope, $flowDataChats, $transferService, $state, $timeout){
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
  $scope.$watch('main.userData', function(newVal){
      if (!$scope.main.userData) {
        return
      }
      else {
        $scope.main.dataUser = newVal;
      }
    });
});
