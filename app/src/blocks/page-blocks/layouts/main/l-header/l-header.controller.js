app.controller('l-header.controller', function($scope, $state){
  var ctrl = this;

  ctrl.$onInit = _onInit;

  function _onInit() {
    $scope.main = $scope.main || {};
    $scope.main.header = {};
    $scope.main.header.date = new Date();
    $scope.bureger = angular.element(document.querySelector('#bureger'));
    $scope.main.contactList = document.querySelector('.contact-list');
  }
  $scope.openProfile = function () {
    $state.go('profile');
  }
  $scope.main.showHideBtnEvent = document.querySelector('.btn-round-warning');
  $scope.$watch('main.eventSideBar', function (newVal) {
    if (!$scope.main.eventSideBar) return;
    $scope.main.eventSideBar = newVal;
  })
  $scope.$watch('main.content', function(newVal){
    if (!$scope.main.content) return;
    $scope.main.content = newVal;
  })

  $scope.main.showHideEventHandler = function (event) {
    let docWidth = document.documentElement.clientWidth;

    if (docWidth > 990) {
      $scope.main.eventSideBar.classList.toggle('no-vis');
      $scope.main.eventSideBar.classList.toggle('is-vis');
      $scope.main.content.classList.toggle('col-lg-6');
      $scope.main.content.classList.toggle('col-md-6');
      $scope.main.content.classList.toggle('col-lg-9');
      $scope.main.content.classList.toggle('col-md-9');
    } else {
      $scope.main.eventSideBar.classList.toggle('no-vis-sm-screen');
      $scope.main.eventSideBar.classList.toggle('is-vis-sm-screen');
    }
    
    $scope.main.contactList.classList.remove('is-vis-contact-list');
    $scope.main.contactList.classList.add('no-vis-contact-list');
    $scope.bureger.toggleClass("fa-indent");
    $scope.bureger.toggleClass("fa-outdent");
    $scope.bureger.toggleClass('hide-scroll');
    event.stopPropagation();
  }
  $scope.main.showHideContacts = function (event) {
    $scope.main.contactList.classList.toggle('no-vis-contact-list');
    $scope.main.contactList.classList.toggle('is-vis-contact-list');
    $scope.main.eventSideBar.classList.remove('is-vis');
    $scope.main.eventSideBar.classList.remove('is-vis-sm-screen');
    $scope.main.eventSideBar.classList.add('no-vis');
    $scope.main.eventSideBar.classList.add('no-vis-sm-screen');
    event.stopPropagation();
  }

  document.onclick = function () {
    $scope.main.eventSideBar.classList.add('no-vis-sm-screen');
    $scope.main.eventSideBar.classList.remove('is-vis-sm-screen');
    $scope.main.contactList.classList.add('no-vis-contact-list');
    $scope.main.contactList.classList.remove('is-vis-contact-list');
  }
  
});
