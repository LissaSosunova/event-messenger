app.controller('main', function($scope, $flowDataUser, $transferService, $timeout,) {

  $scope.main = $scope.main || {};
  $scope.main.eventsForCalendar = [];
  $scope.main.currentEventsArr = [];
  $scope.main.draftEventsArr = [];

  $scope.getUserData = () => $flowDataUser.getDataUser()
    .then(response => {
        $scope.main.userData = response;
        $scope.main.eventsAll = response.events;
        $scope.main.userName = response.name;
        $scope.main.avatar = response.avatar;

        $scope.main.eventsAll.forEach(function (item, i) {
          if($scope.main.eventsAll[i].status === false){
            $scope.main.draftEventsArr.push($scope.main.eventsAll[i]);
          }
        });
        $scope.main.eventsAll.forEach(function (item, i) {
          if($scope.main.eventsAll[i].status === true){
            $scope.main.currentEventsArr.push($scope.main.eventsAll[i]);
          }
        });
        $scope.model = {
          currentEvents: {
            title: 'Current events',
            data: $scope.main.currentEventsArr
          },
          draftEvents: {
            title: 'Draft events',
            data: $scope.main.draftEventsArr
          }
        };

        $scope.main.currentEventsArr.forEach(function (item, index) {
          let eventDate = item.date[0].confirmed;
          let eventDay = eventDate.substr(0, 2);
          let eventMonth = eventDate.substr(3, 2);
          let eventYear = eventDate.substr(6, 4);
          $scope.main.eventsForCalendar.push({
            title: item.name,
            start: new Date(eventYear, eventMonth - 1, eventDay)
          })
        });
        $transferService.setData({name: 'eventsForCalendar', data: $scope.main.eventsForCalendar})
      },
      error => $scope.errorMessage = error.info.message)
  $scope.getUserData();
  $scope.main.settings = $scope.main.settings || {};
  $scope.main.searchEvents = $scope.main.searchEvents || {};
  $timeout(function () {
    $scope.main.eventSideBar = document.querySelector('.right-sidebar');
    $scope.main.content = document.querySelector('.content');
  });

  $scope.main.contactListHandler = function (event) {
    event.stopPropagation();
  }
});


