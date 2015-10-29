//Define WebRTC variables
var PeerConnection = null;
var SessionDescription = null;
var RTCIceCandidate = null;

var socket = null;
var socketInterface = new SocketInterface();
var commuTool = new CommuTool(socketInterface);


var recvFuncs = {};
recvFuncs["roomPeers"] = function(data) {
	//Create ConnectionObj for each roomPeer
	commuTool.createConnectionObjs(data.groupmatesIDs, true);
		
	//Send offers to RoomPeers
	commuTool.sendOfferToGroupmates(data.groupmatesIDs);
};
socketInterface.addRecvFuncs(recvFuncs);

$(document).ready(function() {

	//============
	//===WEBRTC===
	//============
	//Initialize WebRTC variables
	PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || null;
	SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || null;
		
	// The RTCIceCandidate object.
	RTCIceCandidate = window.mozRTCIceCandidate || window.webkitRTCIceCandidate || null;

	if(!PeerConnection) {
		alert("Your browser does not support WebRTC. Get Firefox to use Drawi!");
	}

	//To be Moved elsewhere
	/*
	console.log("connecting...");
	
	//socket = io.connect("p2pChatAndDraw.jit.su:80"); //use this if uploading to nodejitsu
	socket = io.connect("http://nodejswebrtc-pegtest.rhcloud.com:8000/", {'forceNew':true, 'sync disconnect on unload': true });
	//socket = io.connect("127.0.0.1:3000", {'sync disconnect on unload': true }); //use this if running locally
	
	socketInterface.setSocket(socket);
	
	console.log("connected!!!");
	*/
	
	error = function(err) { console.log("ERROR OCCURRED!!!"); console.log(err); endCall(); }
});