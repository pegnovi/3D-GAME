

app.controller('ShopCtrl', ['$scope', '$state', 'shopFactory',
function($scope, $state, shopFactory) {
	
	logger.log("In Shop Controller");
	
	// === ShopController vars === 
	$scope.searchText = "";
	$scope.shopItems = shopFactory.shopItems;
	$scope.cart = shopFactory.cart;

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
	$scope.emptyCart = shopFactory.emptyCart;
	$scope.getShopItem = function(itemName) {
		return $scope.shopItems[itemName];
	};
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
	$scope.buy = function() {
		logger.log("Buy!");
	};
	
}]);