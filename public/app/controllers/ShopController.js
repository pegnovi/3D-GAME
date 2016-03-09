

app.controller('ShopCtrl', ['$scope', '$state', 'itemsFactory',
function($scope, $state, itemsFactory) {
	
	logger.log("In Shop Controller");
	
	// === ShopController vars === 
	$scope.searchText = "";
	$scope.shopItems = itemsFactory.shopItems;
	$scope.cart = itemsFactory.cart;

	// === ShopController functions ===
	$scope.addToCart = function(itemName) {
		if(typeof $scope.cart[itemName] === 'undefined') {
			$scope.cart[itemName] = 1;
		}
		else {
			$scope.cart[itemName] += 1;
		}
	};
	$scope.removeFromCart = function(itemName) {
		delete $scope.cart[itemName];
	};
	$scope.emptyCart = itemsFactory.emptyCart;
	$scope.getShopItem = itemsFactory.getShopItem;
	$scope.goToCart = function() {
		$state.transitionTo('shop.cart');
	};
	$scope.calculateTotalAmountToPay = function() {
		var totalAmountToPay = 0;
		for(var key in $scope.cart) {
			totalAmountToPay += $scope.getShopItem(key).price * $scope.cart[key];
		}
		return totalAmountToPay;
	};
	$scope.unwrapCart = function() {
		var unwrappedCart = [];
		for(var itemName in $scope.cart) {
			if($scope.cart.hasOwnProperty(itemName)) {
				for(var i=0; i<$scope.cart[itemName]; i++) {
					unwrappedCart.push(itemName);
				}
			}
		}
		return unwrappedCart;
	};
	$scope.buy = function() {
		logger.log("Buy!");
		//update user db
		itemsFactory.addItemsToInventory($scope.unwrapCart()).success(function(data) {
			//empty cart
			$scope.emptyCart();
			
			//transition back to store
			$state.transitionTo('shop');
		});
		
		
	};
	
}]);