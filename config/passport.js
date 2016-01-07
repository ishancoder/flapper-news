var passport = require('passport');
var LocalStratagy = require('passport-local').Stratagy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStratagy(
	function(username, password, done) {
		User.findOne({'username': username}, function(err, user) {
			if(err){return done(err);}
			if(!user){
				return done(null, false, {message: "Incorrect Username!"});
			}
			if(!user.validPassword(password)){
				return done(null, false, {message: "Incorrect Password!"});
			}
			return done(null, user);
		});
	}
));