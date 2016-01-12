
var PeersGameState = function() {

	this.readyStates = {}; //peerID : booleanReadyState
	
	//"own" : booleanReadyState
	this.addPeer("own", false);
	
	//add more vars for each peer (or change this.readyStates to a dict of peer state objects)
	
	
};

PeersGameState.prototype.initPeers = function(peerIDs) {
	for(var i=0; i<peerIDs.length; i++) {
		this.readyStates[peerIDs[i]] = false;
	}
};

PeersGameState.prototype.addPeer = function(peerID, readyState) {
	this.readyStates[peerID] = readyState;
};

PeersGameState.prototype.setReadyState = function(peerID, readyState) {
	this.readyStates[peerID] = readyState;
};

PeersGameState.prototype.isReady = function(peerID) {
	return this.readyStates[peerID];
};

