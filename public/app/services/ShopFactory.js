var Item = function(name, imagePath, description, price) {
	this.name = name;
	this.imagePath = imagePath;
	this.description = description;
	this.price = price;
};

//Create the 'shop' factory
app.factory('shopFactory', ['$http', function($http) {

	var obj = {};
	
	var imagePath = "images/shopItemsImages/";
	obj.shopItems = {};
	obj.shopItems["apple"] = new Item("apple", imagePath + "apple.png", "An Apple", 20);
	obj.shopItems["orange"] = new Item("orange", imagePath + "orange.jpg", "An Orange", 60);
	obj.shopItems["grapes"] = new Item("grapes", imagePath + "grapes.jpg", "Some Grapes", 40);
	
	obj.cart = {};
	
	obj.emptyCart = function() {
		obj.cart = {};
	};
	
	return obj;
	
}]);