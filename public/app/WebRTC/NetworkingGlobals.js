//Define WebRTC variables
var PeerConnection = null;
var SessionDescription = null;
var RTCIceCandidate = null;


//Contains socketInterface(webSocket) and commuTool(WebRTC)
var networkInterface = new NetworkInterface();

var peersGameState = new PeersGameState();

//(((((((((((((((())))))))))))))))
//(((((((((( RECV FUNCS ))))))))))
//(((((((((((((((())))))))))))))))
var recvFuncs = {};
recvFuncs["roomPeers"] = function(data) { //This is where actual WebRTC connection happens between peers
	//Create ConnectionObj for each roomPeer
	networkInterface.networks["webRTC"].createConnectionObjs(data.groupmatesIDs, true);
		
	//Send offers to RoomPeers
	networkInterface.networks["webRTC"].sendOfferToGroupmates(data.groupmatesIDs);
};
recvFuncs["peerReadyStates"] = function(data) {
	console.log("PEER READY STATES");
	console.log(data.peerReadyStates);
	for(var key in data.peerReadyStates) {
		if (data.peerReadyStates.hasOwnProperty(key)) {
			console.log("peerID: " + key + " is READY: " + data.peerReadyStates[key].readyState);
			peersGameState.addPeer(key, data.peerReadyStates[key].readyState);
		}
	}
};
/*
recvFuncs["updatePeerReadyState"] = function(data) {
	peersGameState.setReadyState(data.peerID, data.readyState);
};
*/
networkInterface.addRecvFuncs("webSocket", recvFuncs);

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
		alert("Your browser does not support WebRTC. Get Firefox");
	}
	
	error = function(err) { console.log("ERROR OCCURRED!!!"); console.log(err); endCall(); }
});