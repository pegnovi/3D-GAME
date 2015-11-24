function Input(renderer, targetThing, camera) {

	var self = this;
	
	this.gameState = 'In-Game'; 
	this.stateCommandSet = new CommandSet(); //for other classes to hook into depending on state
	this.ownStateCommandSet = new CommandSet(); //for own actions depending on state
	
	
	this.keyboard = new THREEx.KeyboardState(renderer.domElement);
	this.mouseMovX = 0;
	this.mouseMovY = 0;
	
	this.prevLeftClick = false;
	this.leftClick = false;
	this.prevMiddleClick = false;
	this.middleClick = false;
	this.prevRightClick = false;
	this.rightClick = false;
	this.scrollVal = 0;
	
	
	var canvas = renderer.domElement;

	canvas.setAttribute("tabIndex", "0");
	//canvas.focus();
	
	//  ??????????????????????????????????????????????????
	//  ??????????????????????????????????????????????????
	//     Hook Mouse Events to class attributes
	//{ ??????????????????????????????????????????????????
	//  ??????????????????????????????????????????????????
	canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
	//canvas.requestPointerLock();
	
	
	canvas.addEventListener('mousedown', function(event) {
	
		console.log(event);
		console.log(event.button);
	
		//Same thing
		//console.log(document.mozPointerLockElement);
		//console.log($(document).prop('mozPointerLockElement'));
		//NOT same thing
		//console.log($(document).mozPointerLockElement);
		if($(document).prop('pointerLockElement') === canvas ||
		$(document).prop('mozPointerLockElement') === canvas ||
		$(document).prop('webkitPointerLockElement') === canvas) {
			
			console.log('In-Game click');
			if(event.button == 0) {
				self.leftClick = true;
			}
			if(event.button == 1) {
				self.middleClick = true;
			}
			if(event.button == 2) {
				self.rightClick = true;
			}
			
		}
		else { //Not yet locked
			console.log('Out-Game click');
			canvas.requestPointerLock();
			canvas.focus();
		}
		
	}, false);
	
	canvas.addEventListener('mouseup', function(event) {
	
		console.log(event);
		console.log(event.button);
	
		if($(document).prop('pointerLockElement') === canvas ||
		$(document).prop('mozPointerLockElement') === canvas ||
		$(document).prop('webkitPointerLockElement') === canvas) {
			
			console.log('In-Game mouseup');
			if(event.button == 0) {
				self.leftClick = false;
				
			}
			if(event.button == 1) {
				self.middleClick = false;
			}
			if(event.button == 2) {
				self.rightClick = false;
			}
			
		}
		else { //Not yet locked
			console.log('Out-Game mouseup');
		}
		
	}, false);
	
	canvas.addEventListener('DOMMouseScroll', function(event) {

		if($(document).prop('pointerLockElement') === canvas ||
		$(document).prop('mozPointerLockElement') === canvas ||
		$(document).prop('webkitPointerLockElement') === canvas) {
			
			console.log('In-Game mousewheel');
			console.log(event.detail);
			self.scrollVal = event.detail;

		}
		else { //Not yet locked
			console.log('Out-Game mousewheel');
		}
		
	}, false);
	
	
	canvas.addEventListener( 'mousemove', function(event) {
		//console.log(event);
		self.mouseMovX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		self.mouseMovY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
	}, false );
	
	
	//document.addEventListener('mozpointerlockchange', function() { console.log("lock change alert"); }, false);
	$(document).on('mozpointerlockchange', function() { console.log("lock change alert"); });
	document.addEventListener('mozpointerlockerror', function() { console.log("lock error"); }, false);
	
	//}
	//  ??????????????????????????????????????????????????
	//  ??????????????????????????????????????????????????
	

	this.ownStateCommandSet.addCommandFunc('In-Game', function(data) {
		self.resetMouseMovs();
	});
};

Input.prototype.resetMouseMovs = function() {
	this.mouseMovX = 0;
	this.mouseMovY = 0;
};

Input.prototype.updateCamera = function(targetThing, camera) {
	//update camera
	var camOffset = new THREE.Vector3(0, 0, 30);
	//camOffset.applyQuaternion(targetThing.model.quaternion);
	camOffset.applyQuaternion(targetThing.camOrientation);
	
	camOffset.add(targetThing.model.position);
	camera.position.copy(camOffset);
	
	var lookAtTargetVec = new THREE.Vector3();
	lookAtTargetVec.copy(targetThing.model.position);
	lookAtTargetVec.add(targetThing.forward);
	camera.lookAt(lookAtTargetVec);
	//camera.lookAt(new THREE.Vector3(0,0,0));
};