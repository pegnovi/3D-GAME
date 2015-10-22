var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
	roomName: String,
	roomType: String,
	roomPassword: String
});

module.exports = mongoose.model('Room', RoomSchema);