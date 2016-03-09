var Item = function(name, imagePath, description, price) {
	this.name = name;
	this.imagePath = imagePath;
	this.description = description;
	this.price = price;
};

//Create the 'shop' factory
app.factory('itemsFactory', ['$http', function($http) {

	var obj = {};
	
	var imagePath = "images/shopItemsImages/";
	obj.shopItems = {};
	obj.shopItems["apple"] = new Item("apple", imagePath + "apple.png", "An Apple", 20);
	obj.shopItems["orange"] = new Item("orange", imagePath + "orange.jpg", "An Orange", 60);
	obj.shopItems["grapes"] = new Item("grapes", imagePath + "grapes.jpg", "Some Grapes", 40);
	
	obj.items = []; //get player inventory from server
	obj.cart = {};
	
	obj.getShopItem = function(itemName) {
		return obj.shopItems[itemName];
	};
	
	obj.addItemsToInventory = function(cartList) {
		return $http.put('/items', {updateType: "add", nuItems: cartList}).success(function(data) {
			console.log(data);
		});
	}
	obj.deleteItemInInventory = function(indexToDelete) {
		return $http.put('/items', {updateType: "delete", indexToDelete: indexToDelete}).success(function(data) {
			console.log(data);
		});
	};
	obj.getInventory = function() {
		return $http.get('/items').success(function(data) {
			angular.copy(data, obj.items);
		});
	};
	obj.emptyCart = function() {
		obj.cart = {};
	};
	
	return obj;
	
}]);