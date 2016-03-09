//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens

//grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var jwt = require('jsonwebtoken');
var crypto = require('crypto');

var UserSchema = new Schema({
	username: {type: String, unique: true},
	email: {type: String, unique: true},
	hash: String,
	salt: String,
	compartment: {type: mongoose.Schema.Types.ObjectId, ref: 'Compartment'},
	inventory: [String]
});

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};
UserSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return this.hash === hash;
};
UserSchema.methods.generateJWT = function() {
	//set expiration to 60 days
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 60);
	
	//JSON Web Token
	//sign with default (HMAC SHA256)
	//First argument is payload/claims
	//2nd argument is secret key for hashing alg
	return jwt.sign({
						_id: this._id,
						username: this.username,
						exp: parseInt(exp.getTime()/1000),
					}, 
					'SECRET'
	);
};

/*
//user schema
var UserSchema = new Schema({
	name: String,
	username: { type: String, required: true, index: {unique: true} },
	password: { type: String, required: true, select: false }
});

//hash the password before the user is saved
UserSchema.pre('save', function(next) {
	var user = this;
	
	//hash the password only if the password has been changed or user is new
	if(!user.isModified('password')) return next();
	
	//generate the hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if(err) return next(err);
		
		//change the password to the hashed version
		user.password = hash;
		next();
	});
	
});

//method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
	var user = this;
	
	return bcrypt.compareSync(password, user.password);
};
*/

//return the model
module.exports = mongoose.model('User', UserSchema);
