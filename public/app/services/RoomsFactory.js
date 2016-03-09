//Create the 'rooms' factory
app.factory('roomsFactory', ['$http', 'auth', function($http, auth) {

	var obj = {};
	obj.chosenRoomID = -1;
	obj.rooms = [];
	obj.setChosenRoomID = function(id) {
		obj.chosenRoomID = id;
	};
	obj.unsetChosenRoomID = function() {
		obj.chosenRoomID = -1;
	};
	obj.getAllRooms = function() {
		return $http.get('/rooms').success(function(data) {
			angular.copy(data, obj.rooms);
		});
	};
	obj.create = function(room) {
		//no need to attach token to head since it's stored in a cookie (cookies are auto-sent)
		return $http.post('/rooms', room 
						  //{headers: {Authorization: 'Bearer ' + auth.getToken()}}
						 ).success(function(data) {
			obj.rooms.push(data);
		});
	};
	obj.get = function(id) {
		return $http.get('/rooms/' + id).then(function(res) {
			
			//return res.data;
			
			obj.chosenRoom = res.data;
			
		});
	};
	
	
	return obj;
	
}]);