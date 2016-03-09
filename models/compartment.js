//grab the packages that we need for the compartment model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompartmentSchema = new Schema({
	items: [String],
	limit: Number
});

CompartmentSchema.pre('save', function(next) {
	if(this.items.length > this.limit) {
		next(new Error("current items exceed compartment limit"));
	}
	else {
		next();
	}
});

//return the model
module.exports = mongoose.model('Compartment', CompartmentSchema);
