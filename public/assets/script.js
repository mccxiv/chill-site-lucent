var app = angular.module('lucent', ['ngAnimate', 'ngRoute', 'ngResource', 'ngSanitize', 'angular-inview']);

app.config(function($routeProvider) {
	var routes = ['/', '/about', '/projects', '/contact', '/projects/:project'];

	routes.map(addRoute);

	function addRoute(route) {
		var name = route.substring(1) || 'home';
		if (name.indexOf(':') > -1) name = name.split(':')[1];

		$routeProvider.when(route, {
			templateUrl: 'partials/'+name+'.html',
			controller: name
		});
	}
});

app.factory('markdown', function() {
	return new Remarkable({
		html: true
	});
});

app.controller('main', function($scope, $rootScope) {
	$scope.m = {notHome: false};
	$rootScope.$on('$routeChangeSuccess', function(e, curr) {
		$scope.m.notHome = curr.templateUrl !== 'partials/home.html';
	});
});

app.controller('home', function($scope, $timeout) {
	$scope.m = {};
	$timeout(function() {
		// Change needs to happen on next tick
		$scope.m.render = true;
	}, 0);
});

app.controller('projects', function($scope, $resource, $document) {
	$scope.m = {};

	setTimeout(function() {
		$scope.m.posts = $resource('../api/posts/', null, {get: {isArray: true}}).get(function() {
			setTimeout(pauseVideos, 0);
		});
	}, 500);

	$scope.visible = function(index) {
		console.log('visible');
		$scope.m.posts[index].visible = true;
		playVideo(index);
	};

	function pauseVideos() {
		var videos = $document[0].querySelectorAll('.post video');
		for (var i = 0; i < videos.length; i++) {
			videos[i].pause();
		}
	}

	function playVideo(index) {
		var posts = $document[0].querySelectorAll('.post');
		var post = posts[index];
		var videos = post.querySelectorAll('video');
		for (var i = 0; i < videos.length; i++) {
			videos[i].play();
		}
	}
});

app.filter('markdownify', function(markdown) {
	return function(input) {
		return markdown.render(input || '');
	};
});

app.filter('trustAsHtml', function($sce) {
	return function(html) {
		return $sce.trustAsHtml(html);
	};
});