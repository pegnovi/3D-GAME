function World(worldName) {

	this.worldName = worldName;
	this.skybox = new Skybox(worldName);
	this.scene = new THREE.Scene();
	
	this.scene.add(this.skybox.skyboxMesh);
};