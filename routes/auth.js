// =|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=
// =|=|=|= Passport JS and Token stuff =|=|=|=
// =|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=|=
var superSecret = 'blahThisblahIsblahSuperblahSecretblah';
var Expressjwt = require('express-jwt'); //verifies jwt for us and applies this check to routes
//var auth = Expressjwt({secret: "SECRET", userProperty: 'payload'});
//(userProperty: payload) So req.payload will contain the token data (req.user contains it by default)
var auth = Expressjwt({ secret: "SECRET", 
						//(requestProperty: payload) So req.payload will contain the token data (req.user contains it by default)
					    requestProperty: 'payload',
						//by Default, getToken will get the token from req.headers.authorization (which will contain the string "Bearer " + token)
						//so normally, when doing HTTP POST or GET, we attach data to header like this:
						// {headers: {Authorization: 'Bearer ' + token}}
						//Since we store our token in a cookie, we must extract it from the cookie
					    getToken: function getTokenFromCookie(req) {
							if(req.cookies.authToken) {
								return req.cookies.authToken;
							}
							return null;
					    }
					  });
module.exports.auth = auth;