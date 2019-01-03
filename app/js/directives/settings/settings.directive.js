app.directive("settings", function ($state, $socket) {
  return {
    scope: {
      main: '=?settings'
    },
    link: function ($scope) {
      $scope.logOut = function(){
        const token = sessionStorage.getItem('token');
        $socket.sendMesSocket({deleteAuthorId: $scope.main.userData.username, token: token});
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
