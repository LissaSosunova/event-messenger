app.controller('l-chat.controller', function($scope, $transferService, $timeout, $postSendMes, $flowDataChats, $socket){
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
    $scope.notify = false;
    const socket = $socket.socket();
    socket.onmessage = function (event) {
      let incomingMessage = event.data;
      let newMes = JSON.parse(incomingMessage);
      if (newMes.read) {
        $scope.main.chats.unshift(newMes);
        $scope.main.chatWrapper.scrollTo(0, $scope.main.chatBox.clientHeight-$scope.main.chatHeightVis);
      }
    } 
  }

    function idChat () {
    const id = window.location.href.toString().split("/chat/");
    for (let i = 0; i < id.length; i++) {
      return id[1];
    }
  };
  $timeout(()=>{
    sessionStorage.setItem('idChat', idChat());
  });
  sessionStorage.setItem('idChat', idChat());
  $scope.$watch('main.userData', newVal => {
    if (!newVal) {
      return;
    }
    let chatIdObj = {};
    chatIdObj.prev = sessionStorage.getItem('idChat');
    chatIdObj.curr = idChat();
    chatIdObj.destination = $scope.main.currID;
    chatIdObj.token = sessionStorage.getItem('token');
    $transferService.setData({name: 'chatIdPrev', data: chatIdObj.curr});
    $socket.sendSocket(chatIdObj);
    console.log('chat', chatIdObj);
  })
  // $timeout(() => {
  //   let chatIdObj = {};
  //   chatIdObj.prev = sessionStorage.getItem('idChat');
  //   chatIdObj.curr = idChat();
  //   chatIdObj.destination = $scope.main.currID;
  //   chatIdObj.token = sessionStorage.getItem('token');
  //   $transferService.setData({name: 'chatIdPrev', data: chatIdObj.curr});
  //   $socket.sendSocket(chatIdObj);
  //   console.log('chat', chatIdObj);
  // });
  
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
  
  $scope.sendMesHandler = (authorUsername, username, text) => {
    let currentTime = new Date();
    let month = currentTime.getMonth() + 1;
    if (!$scope.main.message) return;
    let chatID = idChat();
    let sender = {
      chatID: chatID,
      authorId: authorUsername,
      destination: username,
      text: text,
      edited: false,
      read: false,
      date: currentTime.getDate() + '-'+month+'-'+currentTime.getFullYear(),
      time: currentTime.getHours() +':'+ currentTime.getMinutes() +':'+ currentTime.getSeconds()
    };
    console.log(sender);
    
    $socket.sendMesSocket(sender);
    $scope.main.chats.unshift(sender);

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
      event.preventDefault(); 
      $scope.sendMesHandler($scope.main.dataUser.username, $scope.main.currID, $scope.main.message);
    }
  }
  $scope.$watch(()=> {
    return $transferService.getData('currName');
  }, newVal => {
    if (!newVal) return;
    $scope.main.currName = newVal;
  })
  $scope.$watch(() => {
    return $transferService.getData('chats')
  }, newVal => {
    $scope.main.chats = newVal;
      $timeout(arrowScrollHandler)
  });

  let note = document.querySelector('#note');
  $scope.showNote = username => {
    //$socket.sendMesSocket({notification: true, destination: username});
    console.log('showNote');
    //note.classList.toggle('non-vis');
  }
  $scope.hideNote = username => {
    //$socket.sendMesSocket({notification: false, destination: username});
    console.log('hideNote');
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
    // $scope.main.note.style.bottom = $scope.main.footer.clientHeight + "px";
  })
  $scope.$watch(()=> {
    return $transferService.getData('incomingMessage')
  }, newVal => {
    if (!newVal) return;
    console.log('new message',newVal);
    $scope.main.chats.unshift(newVal);
    $timeout(arrowScrollHandler);
  })
  $scope.$watch (()=> {
    return $transferService.getData('notify')
  }, newVal => {
    $scope.notify = newVal;
    console.log('$scope.notify', $scope.notify);
  })
});
