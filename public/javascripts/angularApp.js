var app = angular.module('flapperNews', ['ui.router']);

app.config(['$stateProvider','$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
		$stateProvider.state('home',{
			url:'/home',
			templateUrl:'/home.html',
			controller:'MainCtrl',
			resolve:{
				postPromise: ['posts', function(posts){
					return posts.getAll();
				}]
			}
		})
		.state('post',{
			url:'/posts/{id}',
			templateUrl:'/posts.html',
			controller:'PostCtrl',
			resolve:{
				post:['$stateParams','posts', function($stateParams, posts) {
					return posts.get($stateParams.id);
				}]
			}
		});
		$urlRouterProvider.otherwise('home');
}]);

app.factory('posts',['$http',function($http){
	var o = {
		posts:[]
	};

	o.getAll = function() {
		return $http.get('/posts').success(function(data) {
			angular.copy(data, o.posts);
		});
	};

	o.create = function(post) {
		return $http.post('/posts',post).success(function(data) {
			o.posts.push(data);
		});
	};

	o.upvote = function(post) {
		return $http.put('/posts/' + post._id+'/upvote').success(function(data){
			post.upvotes += 1;
		});
	};

	o.get = function(id) {
		return $http.get('/posts/'+id).then(function(res){
			return res.data;
		});
	};

	o.addComment = function(id, comment) {
		return $http.post('/posts/'+id+'/comments/',comment);
	};

	o.upvoteComment = function(post, comment) {
		return $http.put('/posts/'+post._id+'/comments/'+comment._id+'/upvote')
		.success(function(data) {
			comment.upvotes += 1;
		});
	}
	return o;
}]);

app.controller('MainCtrl', [
'$scope','posts',
function($scope,posts){
  	$scope.posts = posts.posts;

	$scope.addPost = function(){
		if(!this.title || this.title ==""){return;}
		posts.create({
			title: $scope.title,
			link: $scope.link
		});
		this.title = "";
		this.link = "";
	};

	$scope.incrementUpvoted = function(post) {
		posts.upvote(post);
	}
}]);

app.controller('PostCtrl',[
	'$scope',
	'posts',
	'post',
	function($scope,posts,post) {
	$scope.post = post;
	$scope.incrementUpvotes = function(comment) {
		posts.upvoteComment(post, comment);
	};
	$scope.addComment = function() {
		posts.addComment(post._id,{
			body: $scope.body,
			author: 'user'
		}).success(function(comment) {
			$scope.post.comments.push(comment);
		});
		this.body = "";
	}
}]);