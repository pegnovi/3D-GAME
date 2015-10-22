function Room(rmName, rmType, rmPswrd) {
	this.roomName = rmName;
	this.roomType = rmType;
	this.roomPassword = rmPswrd;
	
	//this.roomID; //server will provide this
	
};

Room.prototype.setRoomID = function(rmID) {
	this.roomID = rmID;
};