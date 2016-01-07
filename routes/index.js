var express = require('express');
var router = express.Router();
//passport
var passport = require('passport');
var jwt = require('express-jwt');
//mongoose
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*GET Posts page*/
router.get('/posts', function(req, res, next) {
	Post.find(function(err,posts){
		if(err){return next(err);}
		res.json(posts);
	});
});

/*POST Posts page*/
router.post('/posts',function(req, res, next) {
	var post = new Post(req.body);
	post.save(function(err,post){
		if(err){return next(err);}
		res.json(post);
	});
});

router.param('comment', function(req, res, next, id){
	console.log("I was called as NOOOOOOOOT always!") //debug;
	var query = Comment.findById(id);
	query.exec(function(err, comment){
		if(err){return next(err);}
		if(!comment){
			return next(new Error('can not find a comment'));
		}
		req.comment = comment;
		return next();
	});
});


router.param('post', function(req, res, next, id){
	console.log("I was called as always!") //debug;
	var query = Post.findById(id);
	query.exec(function(err, post){
		if(err){return next(err);}
		if(!post){
			return next(new Error('can not find a post'));
		}
		req.post = post;
		return next();
	});
});

router.get('/posts/:post', function(req,res,next){
	req.post.populate('comments', function(err, post){
		if(err){return next(err);}
		res.json(post);
	});
});

router.put('/posts/:post/upvote', function(req, res, next){
	req.post.upvote(function(err,post){
		if(err){return next(err);}
		res.json(post);
	});
});


router.get('/posts/:post/comments/:comment', function(req, res, next){
	console.log("I was also called!");
	res.json(req.comment);
});

router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

router.get('/posts/:post/comments', function(req, res, next) {
	Comment.find(function(err, comments) {
		if(err){return next(err);}
		res.json(comments);
	});
});

router.get('/register', function(req, res, next){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: "Please fill out all fields"});
	}

	var user = new User();
	user.username = req.body.username;
	user.setPassword(req.body.password);
	user.save(function(err){
		if(err){return next(err);}
		return res.json({token: user.generateJWT()});
	});
});

router.get('/login', function(req, res, next) {
	if(!req.body.useranem || !req.body.password) {
		res.status(400).json({message: 'Please fill out all fields'});
	}

	passport.authenticate('local', function(err, user, info){
		if(err){ return next(err); }
		if(user){
			return res.json({token: user.generateJWT()});
		} else {
			return res.status(401).json(info);
		}
	})(req, res, next);
});


router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
	req.comment.upvote(function(err, comment) {
		if(err){return next(err);}
		res.json(comment);
	});
});


module.exports = router;
