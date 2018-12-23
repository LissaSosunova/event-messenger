app.directive("settings", function ($state, $socket) {
  return {
    scope: {
      main: '=?settings'
    },
    link: function ($scope) {
      $scope.logOut = function(){
        $socket.sendMesSocket({deleteAuthorId: $scope.main.userData.username});
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('idChat');
        $state.go('login');
      }
    },
    restrict: "A",
    templateUrl: 'app/js/directives/settings/settings.html',
  }
});
