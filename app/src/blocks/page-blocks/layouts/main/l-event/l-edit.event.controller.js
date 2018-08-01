app.controller('l-edit.event', function($scope, $flowDataEvent, $transferService, $state, $postNewEvent){
  let ctrl = this,
    guests = [];

  $scope.btnConfEv = angular.element(document.querySelector('#confEv'));
  $scope.btnSaveEv = angular.element(document.querySelector('#saveEv'));
  $scope.btnDelDraft = angular.element(document.querySelector('#delDraft'));
  $scope.btnSendInv = angular.element(document.querySelector('#sendInv'));
  $scope.btnOpenEd = angular.element(document.querySelector('#openEditor'));
  $scope.placeDrafts = angular.element(document.querySelector('#placeDrafts'));
  $scope.placeConfr = angular.element(document.querySelector('#placeConfr'));
  $scope.dateConfr = angular.element(document.querySelector('#dateConfr'));
  $scope.dateDrafts = angular.element(document.querySelector('#dateDrafts'));
  $scope.title = angular.element(document.querySelector('#title'));

  ctrl.$onInit = _onInit;

  function _onInit() {
    $scope.main = $scope.main || {};
    $scope.viewEvent = $scope.viewEvent || {};
    if($transferService.getData('one-event')){
      $scope.viewEvent = $transferService.getData('one-event');
      renderAll();
    } else {
      var id = "";
      var idEvent = window.location.href.toString().split("/edit-event/");
      for(let i=0; i < idEvent.length; i++){
        id = idEvent[1];
      }
      refreshEvenet(id);
    }
  }


  function renderAll() {
    let dateDrafts = [],
      dateConf = "",
      placeDraft = [],
      placeConf = "",
      membersInvited = [],
      membersConf = [],
      creator;

    //check dates
    for (let i = 0; i < $scope.viewEvent.date.length; i++) {
      for(let key in $scope.viewEvent.date[i]){
        if($scope.viewEvent.date[i].confirmed === ''){
          if(key === "drafts"){
            dateDrafts = $scope.viewEvent.date[i][key];
            $scope.dateDrafts.removeClass('non-vis');
          }
          dateConf = $scope.viewEvent.date[i][key];
        } else if ($scope.viewEvent.date[i].confirmed !== ''){
          dateConf = $scope.viewEvent.date[i].confirmed;
          $scope.dateConfr.removeClass('non-vis');
        }
      }
    }
    //check places
    for (let i = 0; i < $scope.viewEvent.place.length; i++) {
      for(let key in $scope.viewEvent.place[i]){
        if($scope.viewEvent.place[i].confirmed === ''){
          if(key === "drafts"){
            placeDraft = $scope.viewEvent.place[i][key];
            $scope.placeDrafts.removeClass('non-vis');
          }
          placeConf = $scope.viewEvent.place[i][key];
        } else if ($scope.viewEvent.place[i].confirmed !== ''){
          placeConf = $scope.viewEvent.place[i].confirmed;
          $scope.placeConfr.removeClass('non-vis');
        }

      }
    }
    //creating members groups
    for (let i = 0; i < $scope.viewEvent.members.length; i++) {
      for(let key in $scope.viewEvent.members[i]){
        if(key === "invited"){
          membersInvited = $scope.viewEvent.members[i][key];
        }
        membersConf = $scope.viewEvent.members[i][key];
      }
    }
    for (let i=0; i < membersConf.length; i++){
      if(membersConf[i].role === 'admin'){
        creator = membersConf[i].name;
      }
    }
    //creating model
    $scope.model = {
      status: $scope.viewEvent.status,
      title: $scope.viewEvent.name,
      creator: creator,
      members: {
        membersInv: membersInvited,
        membersConf: membersConf
      },
      placeDrafts: placeDraft,
      placeConf: placeConf,
      dateConf: dateConf,
      dateDrafts: dateDrafts,
      additional: $scope.viewEvent.additional
    };
  }


  function refreshEvenet(id) {
    $flowDataEvent.getDataEvent({'id': id})
      .then(function(response){
        $scope.viewEvent = response;
        renderAll();
        return $scope.viewEvent;
      });
  }
  //Edit params
  $scope.openEditor = function (id1, id2, id3) {

    $scope.editableId1 = angular.element(document.querySelector('#'+id1));
    $scope.editableId2 = angular.element(document.querySelector('#'+id2));
    $scope.editableId3 = angular.element(document.querySelector('#'+id3));

    $scope.editableId1.toggleClass('non-vis');
    $scope.editableId2.toggleClass('non-vis');
    $scope.editableId3.toggleClass('non-vis');
  };

  $scope.confirmEditTitle = function (newValue, id1, id2, id3) {
    $scope.editableId1 = angular.element(document.querySelector('#'+id1));
    $scope.editableId2 = angular.element(document.querySelector('#'+id2));
    $scope.editableId3 = angular.element(document.querySelector('#'+id3));

    $scope.model.title = newValue;
    $scope.editableId1.toggleClass('non-vis');
    $scope.editableId2.toggleClass('non-vis');
    $scope.editableId3.toggleClass('non-vis');
  };

  $scope.confirmEditAditional = function (newValue, id1, id2, id3) {
    $scope.editableId1 = angular.element(document.querySelector('#'+id1));
    $scope.editableId2 = angular.element(document.querySelector('#'+id2));
    $scope.editableId3 = angular.element(document.querySelector('#'+id3));

    $scope.model.additional = newValue;
    $scope.editableId1.toggleClass('non-vis');
    $scope.editableId2.toggleClass('non-vis');
    $scope.editableId3.toggleClass('non-vis');
  }

  function checkBeforeSend(mess) {
    var modal = document.getElementById('myModal');
    var span = document.getElementsByClassName("btn-close")[0];
    $scope.errorMessage = mess;
    modal.style.display = "block";
    $scope.closePopup = function() {
      modal.style.display = "none";
    };
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }
  //Variables for modal messages
  let messCheckContacts = 'You did not select anyone to send the invitation. Select and save guests from the "Participations" list or save the event to drafts.',
    messCheckDate = 'You did not set any date and time. Choose the date in "date" field or save the event as draft.',
    messCheckPlace = 'You did not set any place. Choose the date in "Place" field or save the event as draft.',
    messCheckAllowDate = 'You want to disable voting for the dates, it means that all dates will be approved. If you want to enable voting, press "Allow voting for date" again.',
    messNoTittle = 'You can not save an event without title. Set title in the field "Event title"';

  //Send new Event
  $scope.sendNewEvent = function(params){

    // if($scope.allowingForDates === false){
    //   setDateSend = [
    //     {
    //       "drafts": [
    //         {
    //           "date": '',
    //           "votes": 0
    //         }
    //       ],
    //       "confirmed": $scope.formatedDate(params.date)+ $scope.formatedDate(params.date2)
    //     }
    //   ]
    //   console.log('exact date', setDateSend);
    // } else if ($scope.allowingForDates === true){
    //   console.log('vote date');
    //   setDateSend = [
    //     {
    //       "drafts": [
    //         {
    //           "date": $scope.formatedDate(params.date),
    //           "votes": 1
    //         },
    //         {
    //           "date": $scope.formatedDate(params.date2),
    //           "votes": 0
    //         }
    //       ],
    //       "confirmed": ''
    //     }
    //   ]
    // }
    // if(guests.length <= 0){
    //   checkBeforeSend(messCheckContacts);
    // } else if(!$scope.formatedDate(params.date)){
    //   checkBeforeSend(messCheckDate);
    // } else if(params.place === undefined){
    //   checkBeforeSend(messCheckPlace);
    // } else if (($scope.formatedDate(params.date)) || (guests.length > 0)){

    var newPlaces = function () {
      let placeDraft = [],
      allplaces = [],
      confirmedPlace = '';
      for (let i = 0; i < $scope.viewEvent.place.length; i++) {
        for(let key in $scope.viewEvent.place[i]){
          if($scope.viewEvent.place[i].confirmed === ''){
            if(key === "drafts"){
              placeDraft.push($scope.viewEvent.place[i][key]);
            }
          } else if ($scope.viewEvent.place[i].confirmed !== ''){
            confirmedPlace = $scope.viewEvent.place[i].confirmed;
          }
          allplaces = [
            {
              "drafts": placeDraft
            },
            {
              "confirmed": confirmedPlace
            }
          ]
        }
        console.log(allplaces);
        return allplaces;
      }
    };

      var paramsSend = {
        "id": "new_event",
        "name": params.title,
        "status": true,
        "date": $scope.viewEvent.date,
        "place": $scope.viewEvent.place,
        "members": $scope.viewEvent.members,
        "additional": params.additional
      };
      console.log(paramsSend);
      $postNewEvent.newEvent(paramsSend)
        .then(response => {
            $state.go('main');
          },
          error => $scope.errorMessage = error.info.message);
    // }
  };

  //POST save draft
  $scope.saveEvent = function(params){
    if(!params.name){
      checkBeforeSend(messNoTittle);
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
      "members": [
        {
          "invited": $scope.model.members.membersInv,
          "confirmed": $scope.model.members.membersConf
        }
      ]
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
