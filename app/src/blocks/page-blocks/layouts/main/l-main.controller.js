app.controller('main', function($scope, $state, $flowDataUser, $transferService, $timeout, $socket) {
  $scope.main = $scope.main || {};
  $scope.main.eventsForCalendar = [];
  $scope.main.currentEventsArr = [];
  $scope.main.draftEventsArr = [];
  $scope.main.activeNotifications = [];
  $scope.main.archiveNotifications = [];
  $scope.main.newNotifyCount = false;

  $scope.getUserData = () => $flowDataUser.getDataUser()
    .then(response => {
      if (response.name === "No name"){
        $state.go('profile');
      }
      $scope.main.userData = response;
      $scope.main.eventsAll = response.events;
      $scope.main.userName = response.name;
      // $scope.main.avatar = response.avatar.link;
      $scope.main.notifications = response.notifications;

      $scope.main.eventsAll.forEach(function (item, i) {
        if($scope.main.eventsAll[i].status === false) {
          $scope.main.draftEventsArr.push($scope.main.eventsAll[i]);
        }
      });
      $scope.main.eventsAll.forEach(function (item, i) {
        if($scope.main.eventsAll[i].status === true){
          $scope.main.currentEventsArr.push($scope.main.eventsAll[i])
        };
      });
        $scope.main.userData = response;
        $scope.main.eventsAll = response.events;
        $scope.main.userName = response.name;
        $scope.main.avatar = response.avatar;
        const token = sessionStorage.getItem('token');
        $socket.sendMesSocket({authorId: $scope.main.userData.username, token:token});
        console.log($scope.main);
        $scope.main.eventsAll.forEach((item, i) => {
          if($scope.main.eventsAll[i].status === false){
            $scope.main.draftEventsArr.push($scope.main.eventsAll[i]);
          }
        });
        $scope.main.eventsAll.forEach((item, i) => {
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

      $scope.main.notificationsCount = '!';
      if($scope.main.notifications && $scope.main.notifications.length !==0){
        $scope.main.notifications.forEach(function (item) {
          if(item.status === true){
            $scope.main.activeNotifications.push(item);
            $scope.main.newNotifyCount = true;
            $transferService.setData('newNotifyCount');
          } else if (item.status === false || !item.status){
            $scope.main.archiveNotifications.push(item);
          }
        })
      }


      $scope.main.currentEventsArr.forEach(function (item, index) {
          $scope.main.currentEventsArr.forEach((item, index) => {
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

      $scope.main.settings = $scope.main.settings || {};
      $scope.main.searchEvents = $scope.main.searchEvents || {};
      $timeout(() => {
        $scope.main.eventSideBar = document.querySelector('.right-sidebar');
        $scope.main.content = document.querySelector('.content');
      });

      $scope.main.contactListHandler = event => {
        event.stopPropagation();
      }
  $scope.getUserData();
    });
