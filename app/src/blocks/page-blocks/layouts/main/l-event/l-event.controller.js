app.controller('l-event.controller', function($scope){
  let ctrl = this;
  ctrl.$onInit = _onInit;
  function _onInit() {
    $scope.main = $scope.main || {};
    $scope.main.event = {};
    $scope.main.rightSidebar = document.querySelector('.right-sidebar');
  }
  $scope.main.rightSidebarHandler = function(event){
    event.stopPropagation();
  }
});
