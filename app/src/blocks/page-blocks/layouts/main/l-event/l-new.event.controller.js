app.controller('l-new.event', function($scope, $postNewEvent, $state, $transferService){
  let ctrl = this,
    guests = [],
    setDateSend;
    $scope.dateVote = angular.element(document.querySelector('#dateVote'));
    $scope.placeVote = angular.element(document.querySelector('#placeVote'));
    $scope.nameList = angular.element(document.querySelector('#nameList'));
    $scope.addPpl = angular.element(document.querySelector('#addPpl'));
    $scope.showVar = angular.element(document.querySelector('#showVar'));
    $scope.showVar2 = angular.element(document.querySelector('#showVar2'));
    $scope.dateList = angular.element(document.querySelector('#dateList'));
    $scope.dateList2 = angular.element(document.querySelector('#dateList2'));
    $scope.addDates = angular.element(document.querySelector('#addDates'));
    $scope.allowDates = angular.element(document.querySelector('#allowDates'));
    $scope.allowingForDates = false;
    $scope.addDate = angular.element(document.querySelector('#addDate'));
    $scope.chooseDate = angular.element(document.querySelector('#chooseDate'));


  ctrl.$onInit = _onInit;

  function _onInit() {
    $scope.main = $scope.main || {};
    $scope.main.newEvent = {};
    $scope.checkboxDiv = false;
    $scope.$watch('main.dataUser', function(newValue) {
      if (!$scope.main.dataUser) {
        return;
      }
      $scope.main.dataUser = newValue;
    });
  }

  $scope.selectDates = [
    {
      text: 'Exact date',
      id: 'ED1',
      showInpId: 'exDate',
      typeInp: 'date'
    },
    {
      text: 'Exact date with time',
      id: 'ED2',
      showInpId: 'exDateTime',
      typeInp: 'datetime-local'
    },
    {
      text: 'Diapason of dates',
      id: 'ED3',
      showInpId: 'exDateDiap',
      typeInp: 'date'
    },
    {
      text: 'Diapason of dates with times',
      id: 'ED4',
      showInpId: 'exDateDiapTime',
      typeInp: 'datetime-local'
    }
  ];


  $scope.openVarList = function () {
    $scope.showVar.toggleClass('non-vis');
    $scope.dateList.toggleClass('non-vis');
  };

  $scope.chooseDateType = function (id) {
    $scope.choosed = angular.element(document.querySelector('#'+ id)).toggleClass('non-vis');
    let allVars = document.querySelectorAll('.varlist');
    for (let i=0; i < allVars.length; i++){
      if (allVars[i].id !== id){
        allVars[i].classList.add('non-vis')
      }
    }
    $scope.addDates.toggleClass('non-vis').addClass('create-event-div-box');
    $scope.showVar.toggleClass('non-vis');
    $scope.dateList.toggleClass('non-vis');
  };

  $scope.chooseDateType2 = function (id) {
    console.log(id);
    $scope.choosed = angular.element(document.querySelector('#'+ id)).toggleClass('non-vis');
    let allVars = document.querySelectorAll('.varlist2');
    for (let i=0; i < allVars.length; i++){
      if (allVars[i].id !== id){
        allVars[i].classList.add('non-vis')
      }
    }
    $scope.addDate.html('Second Date: ');
    $scope.chooseDate.html('First Date: ');
    $scope.showVar.toggleClass('non-vis');
    $scope.addDates.toggleClass('non-vis').addClass('create-event-div-box');
    $scope.showVar2.toggleClass('non-vis');
    $scope.dateList2.toggleClass('non-vis');
  };

  $scope.addDatesAndAllow = function () {
    $scope.dateList2.toggleClass('non-vis');
    $scope.allowDates.toggleClass('non-vis').addClass('create-event-div-box');
    $scope.allowingForDates = true;
  };

  $scope.addDateVote = function () {
    if($scope.dateVote.hasClass('fa-toggle-on')){
      openModalMessage(messCheckAllowDate);
      $scope.allowingForDates = false;
    } else if ($scope.dateVote.hasClass("fa-toggle-off")){
      $scope.allowingForDates = true;
    }
    $scope.dateVote.toggleClass('fa-toggle-off').toggleClass('fa-toggle-on');
    console.log($scope.allowingForDates);
  };
  $scope.addPlaceVote = function () {
    $scope.placeVote.toggleClass('fa-toggle-off').toggleClass('fa-toggle-on');
  };
  $scope.openList = function () {
    $scope.nameList.toggleClass('non-vis');
    $scope.addPpl.toggleClass("fa-plus").toggleClass("fa-minus");
  };
  $scope.closeList = function () {
    $scope.nameList.toggleClass('non-vis');
    $scope.addPpl.toggleClass("fa-plus").toggleClass("fa-minus");
  };
  $scope.guestsList = function () {
    let allInp = document.querySelectorAll('.names');
    let newGusts = [];
    for (let i=0; i<allInp.length;i++){
      if(allInp[i].checked){
        var invited = {
          "name": allInp[i].value,
          "username": allInp[i].id,
          "role": "user",
          "chat_success": false
        };
        newGusts.push(invited);
      }
    }
    guests = newGusts;
    $scope.nameList.toggleClass('non-vis');
    $scope.addPpl.toggleClass("fa-plus").toggleClass("fa-minus");
  };

  $scope.formatedDate = function (setDate) {
    var confdate;
    if(!setDate){
      confdate = '';
      return confdate;
    }
    var dd = setDate.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = setDate.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yyyy = setDate.getFullYear();

    var hh = setDate.getHours();
    if (hh < 10) hh = '0' + hh;
    var min =  setDate.getMinutes();
    if (min < 10) min = '0' + min;

    confdate = dd + '.' + mm + '.' + yyyy + ', time: '+ hh + ':' + min;

    return confdate;
  };

   //Variables for modal messages
   let messCheckContacts = 'You did not select anyone to send the invitation. Select and save guests from the "Participations" list or save the event to drafts.',
     messCheckDate = 'You did not set any date and time. Choose the date in "date" field or save the event as draft.',
     messCheckPlace = 'You did not set any place. Choose the date in "Place" field or save the event as draft.',
     messCheckAllowDate = 'You want to disable voting for the dates, it means that all dates will be approved. If you want to enable voting, press "Allow voting for date" again.',
     messNoTittle = 'You can not save an event without title. Set title in the field "Event title"';

  //Send new Event
  $scope.sendNewEvent = function(params){

    if($scope.allowingForDates === false){
      setDateSend = [
        {
          "drafts": [
            {
              "date": '',
              "votes": 0
            }
          ],
          "confirmed": $scope.formatedDate(params.date)+ $scope.formatedDate(params.date2)
        }
      ]
    } else if ($scope.allowingForDates === true){
      setDateSend = [
        {
          "drafts": [
            {
              "date": $scope.formatedDate(params.date),
              "votes": 1
            },
            {
              "date": $scope.formatedDate(params.date2),
              "votes": 0
            }
          ],
          "confirmed": ''
        }
      ]
    }
    if(guests.length <= 0){
      openModalMessage(messCheckContacts);
    } else if(!$scope.formatedDate(params.date)){
      openModalMessage(messCheckDate);
    } else if(params.place === undefined){
      openModalMessage(messCheckPlace);
    } else if (($scope.formatedDate(params.date)) || (guests.length > 0)){
      var paramsSend = {
        "id": "new_event",
        "name": params.name,
        "status": true,
        "date": setDateSend,
        "place": [
          {
            "drafts": [
              {
                "place": '',
                "votes": 0
              }
            ],
            "confirmed": params.place
          }
        ],
        "members": {
            "invited": guests,
            "confirmed": [
              {
                "id": $scope.main.dataUser.id,
                "name": $scope.main.dataUser.name,
                "role": "admin",
                "chat_success": true
              }
            ]
          },
        "additional": params.additional
      };
      $postNewEvent.newEvent(paramsSend)
        .then(response => {
            $state.go('main');
          },
          error => $scope.errorMessage = error.info.message);
    }
  };

  //POST save draft
  $scope.saveEvent = function(params){
  if(!params.name){
    openModalMessage(messNoTittle);
    return;
  }
    if($scope.allowingForDates === false){
      setDateSend = [
        {
          "drafts": [
            {
              "date": '',
              "votes": 0
            }
          ],
          "confirmed": $scope.formatedDate(params.date)+ ' ' + $scope.formatedDate(params.date2)
        }
      ]
      console.log('exact date', setDateSend);
    } else if ($scope.allowingForDates === true){
      console.log('vote date', $scope.formatedDate(params.date), $scope.formatedDate(params.date2));
      setDateSend = [
        {
          "drafts": [
            {
              "date": $scope.formatedDate(params.date),
              "votes": 1
            },
            {
              "date": $scope.formatedDate(params.date2),
              "votes": 0
            }
          ],
          "confirmed": ''
        }
      ]
    }
    var paramsSend = {
      "id": "new_event",
      "name": params.name,
      "status": false,
      "date": setDateSend,
      "place": [
        {
          "drafts": [
            {
              "place": '',
              "votes": 0
            }
          ],
          "confirmed": params.place
        }
      ],
      "members":
          {
          "invited": guests,
          "confirmed": [
            {
              "id": $scope.main.dataUser.id,
              "name": $scope.main.dataUser.name,
              "role": "admin",
              "chat_success": true
            }
          ]
        }
    };
    $postNewEvent.newEvent(paramsSend)
      .then(response => {
          $state.go('main');
        },
        error => $scope.errorMessage = error.info.message);
  };

  $scope.cancel = function () {
    $state.go('main');
  }
});
