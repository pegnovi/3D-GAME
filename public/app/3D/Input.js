function Input(renderer, targetThing, camera) {
	var that = this;

	this.keyboard = new THREEx.KeyboardState(renderer.domElement);
	this.mouseMovX = 0;
	this.mouseMovY = 0;
	
	this.leftClick = false;
	this.middleClick = false;
	this.rightClick = false;
	this.scrollVal = 0;
	
	this.thingController = new ThingController(targetThing, camera);
	
	
	var canvas = renderer.domElement;

	canvas.setAttribute("tabIndex", "0");
	//canvas.focus();
	
	//Hook Mouse Events to class attributes
	//??????????????????????????????????????????????????
	//??????????????????????????????????????????????????
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
				that.leftClick = true;
			}
			if(event.button == 1) {
				that.middleClick = true;
			}
			if(event.button == 2) {
				that.rightClick = true;
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
				that.leftClick = false;
			}
			if(event.button == 1) {
				that.middleClick = false;
			}
			if(event.button == 2) {
				that.rightClick = false;
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
			that.scrollVal = event.detail;

		}
		else { //Not yet locked
			console.log('Out-Game mousewheel');
		}
		
	}, false);
	
	
	canvas.addEventListener( 'mousemove', function(event) {
		//console.log(event);
		that.mouseMovX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		that.mouseMovY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
	}, false );
	
	
	//document.addEventListener('mozpointerlockchange', function() { console.log("lock change alert"); }, false);
	$(document).on('mozpointerlockchange', function() { console.log("lock change alert"); });
	document.addEventListener('mozpointerlockerror', function() { console.log("lock error"); }, false);
	
	//??????????????????????????????????????????????????
	//??????????????????????????????????????????????????
	
	
	
	//In-Game Input Update Functions
	this.inGameUpdateFuncs = [];
	this.inGameUpdateFuncs.push(function(delta, now) {
		
		that.thingController.processUserInput(delta, now, 
							that.mouseMovX, that.mouseMovY, 
							that.leftClick, that.rightClick, 
							that.scrollVal, 
							that.keyboard);
		that.resetMouseMovs();
		
		/*
		var kb = that.keyboard;
	
		var userActed = false;
		
		if(that.mouseMovX != 0) {
			targetThing.rotate(targetThing.up, -that.mouseMovX*0.1, false);
			targetThing.rotateCam(targetThing.up, -that.mouseMovX*0.1);
			userActed = true;
			that.mouseMovX = 0;
		}
		if(that.mouseMovY != 0) {
			//targetThing.rotate(targetThing.right, -that.mouseMovY*0.1, false);
			targetThing.rotateCam(targetThing.right, -that.mouseMovY*0.1);
			userActed = true;
			that.mouseMovY = 0;
		}
	
		//console.log("keyboard = "); console.log(keyboard);
		//console.log("delta = " + delta);
		if( kb.pressed('d') ) {
			targetThing.move(targetThing.right, 100*delta);
			userActed = true;
		}
		else if( kb.pressed('a') ) {
			var moveVec = new THREE.Vector3();
			moveVec.copy(targetThing.right);
			moveVec.negate();
			targetThing.move(moveVec, 100*delta);
			userActed = true;
		}
		
		if( kb.pressed('w') ) {
			targetThing.move(targetThing.forward, 100*delta);
			userActed = true;
		}
		else if( kb.pressed('s') ) {
			var moveVec = new THREE.Vector3();
			moveVec.copy(targetThing.forward);
			moveVec.negate();
			targetThing.move(moveVec, 100*delta);
			userActed = true;
		}
		
		if( kb.pressed('space') ) {
			targetThing.move(targetThing.up, 100*delta);
			userActed = true;
		}
		else if( kb.pressed('x') ) {
			var moveVec = new THREE.Vector3();
			moveVec.copy(targetThing.up);
			moveVec.negate();
			targetThing.move(moveVec, 100*delta);
			userActed = true;
		}
		
		if(userActed == true) {
			that.updateCamera(targetThing, camera);
		}
		*/
		
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