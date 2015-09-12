var app = angular.module('lucent', ['ngAnimate', 'ngRoute', 'ngResource', 'ngSanitize']);

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
	$scope.m = {isHome: false};
	$rootScope.$on('$routeChangeSuccess', function(e, curr) {
		$scope.m.isHome = (curr.templateUrl === 'partials/home.html');
	});
});

app.controller('home', function($scope) {

});

app.controller('projects', function($scope, $resource) {
	$scope.m.posts = {}; // TODO why is this necessary?
	setTimeout(function() {
		$scope.m.posts = $resource('../api/posts/', null, {get: {isArray: true}}).get(function() {
			setTimeout(function() {
				$('video').attr({
					autoplay: '',
					loop: '',
					muted: ''
				});
			}, 0);
		});
	}, 500);

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