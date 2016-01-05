var app = angular.module('flapperNews', ['ui.router']);

app.config(['$stateProvider','$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
		$stateProvider.state('home',{
			url:'/home',
			templateUrl:'/home.html',
			controller:'MainCtrl'
		})
		.state('post',{
			url:'/posts/{id}',
			templateUrl:'/posts.html',
			controller:'PostCtrl'
		});
		$urlRouterProvider.otherwise('home');
}]);

app.factory('posts',[function(){
	var o = {
		posts:[]
	};
	return o;
}]);

app.controller('MainCtrl', [
'$scope','posts',
function($scope,posts){
  	$scope.posts = posts.posts;

	$scope.addPost = function(){
		if(!this.title || this.title ==""){return;}
		this.posts.push({
			title:$scope.title, 
			link:$scope.link, 
			upvotes:0,
			comments:[
				{author:'Joe', body:'Cool Post', upvotes:0},
				{author:'Chotta Bheem', body:'Bheem ki shakti dhoom machaye', upvotes:0},
			]});
		this.title = "";
		this.link = "";
	};

	$scope.incrementUpvoted = function(post) {
		post.upvotes += 1;
	}
}]);

app.controller('PostCtrl',['$scope','$stateParams','posts',function($scope,$stateParams,posts) {
	$scope.post = posts.posts[$stateParams.id];
	$scope.incrementUpvotes = function(comment) {
		comment.upvotes += 1;
	};
	$scope.addComment = function() {
		this.post.comments.push({
			author: 'user',
			body: $scope.body,
			upvotes: 0
		});
		this.body = "";
	}
}]);