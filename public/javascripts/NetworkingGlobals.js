var PeerConnection = null;
var SessionDescription = null;
var RTCIceCandidate = null;

var socket = null;
var socketInterface = SocketInterface.create();

$(document).ready(function() {

	//============
	//===WEBRTC===
	//============
	PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || null;
	SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || null;
		
	// The RTCIceCandidate object.
	RTCIceCandidate = window.mozRTCIceCandidate || window.webkitRTCIceCandidate || null;

	if(!PeerConnection) {
		alert("Your browser does not support WebRTC. Get Firefox to use Drawi!");
	}

	console.log("connecting...");
	
	//socket = io.connect("p2pChatAndDraw.jit.su:80"); //use this if uploading to nodejitsu
	socket = io.connect("http://nodejswebrtc-pegtest.rhcloud.com:8000/", {'forceNew':true});
	//socket = io.connect("127.0.0.1:3000"); //use this if running locally
	
	socketInterface.setSocket(socket);
	
	console.log("connected!!!");
	
	error = function(err) { console.log("ERROR OCCURRED!!!"); console.log(err); endCall(); }
});