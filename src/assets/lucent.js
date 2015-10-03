var app = angular.module('lucent', ['ngAnimate', 'ngRoute', 'ngResource', 'ngSanitize', 'angular-inview']);

app.config(function ($routeProvider) {
	var routes = ['/', '/about', '/projects', '/projects/:project', '/contact', '/hire'];

	routes.map(addRoute);

	function addRoute(route) {
		var name = route.substring(1) || 'home';
		if (name.indexOf(':') > -1) name = name.split(':')[1];

		$routeProvider.when(route, {
			templateUrl: 'partials/' + name + '.html',
			controller: name
		});
	}
});

app.factory('markdown', function () {
	return new Remarkable({
		html: true
	});
});

app.controller('main', function ($scope, $rootScope, $timeout) {
	$scope.m = {
		notHome: false
	};

	$rootScope.$on('$routeChangeSuccess', function (e, curr) {
		// Make sure animation is triggered when landing on any page
		$timeout(function () {
			$scope.m.notHome = curr.templateUrl !== 'partials/home.html';
		}, 0);
	});
});

app.controller('home', function ($rootScope, $scope, $timeout) {
	$scope.m = {};
	$rootScope.pageTitle = 'andrea\'s page';
	$timeout(function () {
		$scope.m.render = true;
	}, 0);
});

app.controller('projects', function ($rootScope, $scope, $resource, $document) {
	$scope.m = {};
	$rootScope.pageTitle = 'andrea\'s projects';

	setTimeout(function () {
		$scope.m.posts = $resource('chill/api/posts/', null, {get: {isArray: true}}).get(function () {
			setTimeout(pauseVideos, 0);
		});
	}, 500);

	$scope.visible = function (post) {
		post.visible = true;
		playVideo(post);
	};

	function pauseVideos() {
		var videos = $document[0].querySelectorAll('.post video');
		for (var i = 0; i < videos.length; i++) {
			videos[i].pause();
		}
	}

	function playVideo(post) {
		var element = $document[0].getElementById(post.id);
		var videos = element.querySelectorAll('video');
		for (var i = 0; i < videos.length; i++) {
			videos[i].play();
		}
	}
});

app.controller('project', function ($rootScope, $scope, $routeParams, $resource) {
	$scope.m.post = $resource('chill/api/posts/' + $routeParams.project).get(function () {
		$rootScope.pageTitle = $scope.m.post.title;
	});
});

app.controller('contact', function ($rootScope) {
	$rootScope.pageTitle = 'get in contact with andrea'
});

app.controller('hire', function ($rootScope) {
	$rootScope.pageTitle = 'hire andrea';
});

app.filter('markdownify', function (markdown) {
	return function (input) {
		return markdown.render(input || '');
	};
});

app.filter('trustAsHtml', function ($sce) {
	return function (html) {
		return $sce.trustAsHtml(html);
	};
});