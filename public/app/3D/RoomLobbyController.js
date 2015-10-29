app.controller('RoomLobbyCtrl', ['$scope', '$state', 'roomsFactory', function($scope, $state, roomsFactory) {
	
	console.log("In Room Lobby Controller");
	
	$scope.getRoomID = function() {
		console.log(roomsFactory.chosenRoomID);
	};
	
}]);