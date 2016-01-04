app.controller('RoomsCtrl', ['$scope', '$state', 'roomsFactory', function($scope, $state, roomsFactory) {
	
	logger.log("In Rooms Controller");
	
	// === RoomsController vars === 
	$scope.selectedRoom = null;
	$scope.nuRoomName = "";
	$scope.nuRoomType = "";
	$scope.nuRoomPassword = "";
	$scope.roomTypes = ['Deathmatch','Normal','Tag','Grid','Clan','Practice','Ranked'];
	$scope.rooms = roomsFactory.rooms;
	
	
	// === RoomsController functions ===
	$scope.sayRoom = function() {
		console.log($scope.selectedRoom);
	};
	
	$scope.createRoom = function() {
	
		if($scope.nuRoomName.length < 1) {
			alert("Room Must Have Name!!!");
		}
		else if($scope.nuRoomType.length < 1) {
			alert("Room Must Have Type!!!");
		}
		else {
		
			//$scope.rooms.push(new Room($scope.nuRoomName, $scope.nuRoomType, $scope.nuRoomPassword));
			
			logger.log("Creating Room : " + $scope.nuRoomName + ", " + $scope.nuRoomType + ", " + $scope.nuRoomPassword);
			roomsFactory.create(new Room($scope.nuRoomName, $scope.nuRoomType, $scope.nuRoomPassword));
			logger.log("Created Room!");

			$scope.resetNuRoomVars();
		}
	};
	
	$scope.joinRoom = function() {
		if($scope.selectedRoom != null) {
			logger.log("Joining Room " + $scope.selectedRoom._id);
			roomsFactory.setChosenRoomID($scope.selectedRoom._id);
			$state.transitionTo('game.roomLobby');
		}
		else {
			alert("Please Select A Room");
		}
	};
	
	$scope.resetNuRoomVars = function() {
		$scope.nuRoomName = "";
		$scope.nuRoomType = "";
		$scope.nuRoomPassword = "";
	};
}]);