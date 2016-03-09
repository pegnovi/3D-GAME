//grab the packages that we need for the item model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
	name: {type: String, unique: true},
	imagePath: String,
	description: String,
	price: Number
});

//return the model
module.exports = mongoose.model('Item', ItemSchema);
