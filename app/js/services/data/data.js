app.factory('$data', ['$resource', '$defaultService', '$token', function ($resource, $defaultService, $token) {
	let _$data = {},
		_url = $defaultService.getURI();

    _$data.auth = $resource(_url + '/login/',{},{
		action:{
			method: "POST"
		}
	});
  _$data.registration = $resource(_url + '/user/',{},{
    action: {
      method: "POST"
    }
    });
  _$data.main = $resource(_url + '/user/', {},{
    action:{
      method: "GET",
      headers: {
     'Authorization': $token.getToken
      }
    }
  });
  _$data.findUser = $resource(_url + '/finduser/', {},{
    action:{
      method: "POST",
      isArray: true,
      headers: {
     'Authorization': $token.getToken
      }
    }
  });
  _$data.addUser = $resource(_url + '/adduser/', {},{
    action:{
      method: "POST",
      headers: {
     'Authorization': $token.getToken
      }
    }
  });
  _$data.profile = $resource(_url + '/profile/',{},{
    action: {
      method: "POST",
      headers: {
        /**
         * @return {string}
         */
        'Authorization': $token.getToken
      }
    }
  });
  _$data.confirm = $resource(_url + '/confirmation/',{},{
    action: {
      method: "GET",
      params: {
        token: "@token"
      }
    }
  });
  _$data.new_event = $resource(_url + '/new_event/',{},{
    action: {
      method: "POST",
      headers: {
        /**
         * @return {string}
         */
        'Authorization': $token.getToken
      }
    }
  });



  _$data.event = $resource(_url + '/event/:id', {},{
    action:{
      method: "GET",
      params:{
        data:"@id"
      },
      headers: {
        /**
         * @return {string}
         */
        'Authorization': $token.getToken
      }
    }
  });

	_$data.chats = $resource(_url + '/chat/', {id: '@id'}, {
	  action: {
	    method: "GET",
      headers: {
        'Authorization': $token.getToken
      }
    }
  });

  _$data.sendMes = $resource(_url + '/sendmes/',{},{
    action:{
      method: "POST",
      headers: {
        /**
         * @return {string}
         */
        'Authorization': $token.getToken
      }
    }
  });

  return _$data;
}]);
