
function Graphics() {

	//Container && Renderer
	this.container = $('#gameScreenID');
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize(WIDTH, HEIGHT);
	this.container.append(this.renderer.domElement);
	
};