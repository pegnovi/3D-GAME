var WIDTH = 600;
var HEIGHT = 400;
var VIEW_ANGLE = 45;
var ASPECT = WIDTH/HEIGHT;
var NEAR = 0.1;
var FAR = 1000;

function Game() {

	//Physics & Collision
	Physijs.scripts.worker = dir_path + "libs/chandlerprall-Physijs-d19a7bf/physijs_worker.js";
	Physijs.scripts.ammo = dir_path + "app/3D/libs/ammo.js";

	//contains Container & Renderer
	this.graphics = new Graphics();

	//contains Scene & Skybox
	this.world = new World("kimmy");
	
	//Camera
	this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	

	
	//Add stuff to scene
	//++++++++++++++++++++
	this.world.scene.add(this.camera);
	this.camera.position.set(0, 5, 10);
	console.log("cam parent = " );
	console.log(this.camera.parent);
	
	var geometry = new THREE.CubeGeometry( 1, 1, 1 );
	//var geometry = new THREE.BoxGeometry(3, 3, 3);
	//var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var material = new THREE.MeshLambertMaterial( { color: 0xCC0000 } );
	this.cube = new THREE.Mesh( geometry, material );
	this.world.scene.add( this.cube );

	//Light
	var pointLight = new THREE.PointLight(0xFFFFFF);
	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 30;
	// add to the scene
	this.world.scene.add(pointLight);
	//++++++++++++++++++++

	//this.loader = new THREEx.UniversalLoader();
	this.loader = new THREE.JSONLoader;
	this.thing = new Thing(this.loader, "humanLowPoly8.json", this.world.scene, this.camera);
	
	//User Input
	//->->->->->->->->->->->->->->->->->->->->
	this.input = new Input(this.graphics.renderer, this.thing, this.camera);
	//->->->->->->->->->->->->->->->->->->->->
	
	
};

Game.prototype.runGame = function() {

	var daWorld = this.world;
	var daCamera = this.camera;
	var daInput = this.input;
	var daGraphics = this.graphics;
	var daThing = this.thing;
	
	var lastTimeMsec = null;
	
	//Start the main loop
	//https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
	requestAnimationFrame(function run(currTimeMsec) {

		//console.log("In Run!!!");
		
		//keep looping
		requestAnimationFrame( run );
	
		//measure times
		lastTimeMsec = lastTimeMsec || currTimeMsec-1000/60; //currTimeMsec - 1000ms/60frames
		var deltaMsec = Math.min(200, currTimeMsec - lastTimeMsec);
		lastTimeMsec = currTimeMsec;

		
		if(daThing.animations !== undefined) {
			THREE.AnimationHandler.update( deltaMsec/2000 );
		}
		if ( daThing.helper !== undefined ) {
			daThing.helper.update();
		}
		
		
		//call update functions
		daInput.inGameUpdateFuncs.forEach(function(updateFn) {
		//updateFuncts.forEach(function(updateFn) {
			updateFn(deltaMsec/1000, currTimeMsec/1000);
		});
		
		//draw
		daGraphics.renderer.render( daWorld.scene, daCamera );
	});
};