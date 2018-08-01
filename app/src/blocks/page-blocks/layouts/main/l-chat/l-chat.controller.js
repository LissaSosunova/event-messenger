app.controller('l-chat.controller', function($scope, $transferService, $timeout, $postSendMes, $flowDataChats){
  let ctrl = this;
  ctrl.$onInit = _init;

  function _init () {
    $scope.main = $scope.main || {};
    $scope.main.inputMes = document.querySelector('.text-block');
    $scope.main.sendBtn = document.querySelector('button[type = "send"]');
    $scope.main.message;
    $scope.main.chatWrapper = document.querySelector('.chat-wraper');
    $scope.main.chatBox = document.querySelector('.chat-box');
    $scope.main.head = document.querySelector('.div-row-main-page');
    $scope.main.footer = document.querySelector('.div-row-footer');
    $scope.main.hiddenDiv = document.querySelector('.hiddenDiv');
    $scope.main.showArrow = false;
    $scope.main.note = document.querySelector('#note');
  }

    function idChat () {
    var id = window.location.href.toString().split("/chat/");
    for (let i = 0; i < id.length; i++) {
      return id[1];
    }
  };

  function scrollHandler () {
    $scope.main.contentChatHeight = $scope.main.chatBox.clientHeight;
    $transferService.setData({name: 'currScroll', data: $scope.main.contentChatHeight-$scope.main.chatHeightVis});
    $scope.main.chatWrapper.scrollTo(0, $transferService.getData('currScroll'));
  }

  function arrowScrollHandler () {
    $scope.main.contentChatHeight = $scope.main.chatBox.clientHeight;
    $scope.main.chatHeightVis = document.documentElement.clientHeight -
    $scope.main.head.clientHeight  -
    $scope.main.footer.clientHeight;

    $scope.main.chatWrapper.onscroll = () => {
      let arrow = document.querySelector('#down');
      let scrolled = $scope.main.chatWrapper.pageYOffset || $scope.main.chatWrapper.scrollTop;
      $scope.main.chatHeightVis = document.documentElement.clientHeight -
      $scope.main.head.clientHeight -
      $scope.main.footer.clientHeight;
      $scope.main.contentChatHeight = $scope.main.chatBox.clientHeight;
      $transferService.setData({name: 'currScroll', data: $scope.main.contentChatHeight-$scope.main.chatHeightVis});
        if (scrolled < $scope.main.contentChatHeight-2*$scope.main.chatHeightVis) {
          $scope.main.showArrow = true;
          $scope.$apply();
        }
        else if (scrolled >= $scope.main.contentChatHeight-2*$scope.main.chatHeightVis) {
          $scope.main.showArrow = false;
          $scope.$apply();
        }
        if (arrow) {
          if ($scope.main.eventSideBar.classList.contains('no-vis')) {
            arrow.classList.remove('arrow-center');
            arrow.classList.add('arrow-right');
          }
          else {
            arrow.classList.add('arrow-center');
            arrow.classList.remove('arrow-right');
          }
        }
      };
      $scope.scrollDown = () => {
        $scope.main.chatWrapper.scrollTo(0, $transferService.getData('currScroll'));
        };
      $scope.main.chatWrapper.scrollTo(0, $scope.main.contentChatHeight-$scope.main.chatHeightVis);
  }

  $scope.sendMesHandler = (author, usename, text) => {
    let currentTime = new Date();
    let month = currentTime.getMonth() + 1;
    if (!$scope.main.message) return;
    var id = idChat();
    let sender = {
      id: id,
      author: author,
      usename: usename,
      text: text,
      date: currentTime.getDate() + '-'+month+'-'+currentTime.getFullYear(),
      time: currentTime.getHours() +':'+ currentTime.getMinutes() +':'+ currentTime.getSeconds()
    };
    $postSendMes.sendMes(sender)
      .then(response => {
        $scope.main.chats = response.messages;
      });
    $scope.main.inputMes.value = "";
    $scope.main.message = "";

    $timeout(scrollHandler,100);
    $timeout(() => {
      $scope.main.chatWrapper.style.height = (document.documentElement.clientHeight -
      $scope.main.head.clientHeight -
      $scope.main.footer.clientHeight) + "px";
    },100)
  };
  $scope.sendMesEnter = event => {
    if (event.shiftKey && event.charCode == 13) return;
    else if (event.charCode == 13) {
      $scope.sendMesHandler($scope.main.userName, $scope.main.currID, $scope.main.message);
      event.preventDefault();
    }
  }
  $scope.$watch(() => {
    return $transferService.getData('chats')
  }, newVal => {
    $scope.main.chats = newVal;
      $timeout(arrowScrollHandler)
  });

  let note = document.querySelector('#note');
  $scope.showNote = () => {
    note.classList.toggle('non-vis');
  }
  $scope.$watch(()=> {
    return $transferService.getData('currID')},
    newVal => {
      $scope.main.currID = newVal;
  })
  $scope.$watch('main.inputMesHeight', newVal => {
    $scope.main.currInputMesHeight = newVal;
    $scope.main.chatHeightVis = document.documentElement.clientHeight -
    $scope.main.head.clientHeight  -
    $scope.main.footer.clientHeight;
    $scope.main.chatWrapper.style.height = $scope.main.chatHeightVis+"px";
    $scope.main.chatWrapper.scrollTo(0, $scope.main.contentChatHeight-$scope.main.chatHeightVis);
    $scope.main.note.style.bottom = $scope.main.footer.clientHeight + "px";
  })
});
