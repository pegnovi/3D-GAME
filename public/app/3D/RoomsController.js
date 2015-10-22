app.controller('RoomsCtrl', ['$scope', 'roomsFactory', function($scope, roomsFactory) {
	
	console.log("In Rooms Controller");
	
	
	$scope.selectedRoom = null;
	$scope.nuRoomName = "";
	$scope.nuRoomType = "";
	$scope.nuRoomPassword = "";
	
	$scope.rooms = roomsFactory.rooms;
	
	
	$scope.roomTypes = ['Deathmatch','Normal','Tag','Grid','Clan','Practice','Ranked'];
	
	
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
			
			roomsFactory.create(new Room($scope.nuRoomName, $scope.nuRoomType, $scope.nuRoomPassword));
			
			$scope.resetNuRoomVars();
		}
	};
	
	$scope.joinRoom = function() {
		if($scope.selectedRoom != null) {
			console.log("there is a selected room!!!");
			roomsFactory.setChosenRoomID($scope.selectedRoom._id);
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