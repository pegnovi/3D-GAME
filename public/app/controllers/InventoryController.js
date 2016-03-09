

app.controller('InventoryCtrl', ['$scope', '$state', 'itemsFactory',
function($scope, $state, itemsFactory) {
	
	logger.log("In Inventory Controller");
	
	// === InventoryController vars === 
	$scope.searchText = "";
	$scope.items = itemsFactory.items;

	// === InventoryController functions ===
	$scope.getShopItem = itemsFactory.getShopItem;
	$scope.useItem = function(itemIndex) {
		//get the item
		//run its use function
		
		
		//delete the item
		itemsFactory.deleteItemInInventory(itemIndex);
		$scope.items.splice(itemIndex, 1);
	};
	
}]);