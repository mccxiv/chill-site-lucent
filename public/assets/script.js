var app = angular.module('lucent', ['ngAnimate', 'ngRoute']);

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

app.controller('main', function($scope, $rootScope) {
	$scope.m = {isHome: false};
	$rootScope.$on('$routeChangeSuccess', function(e, curr) {
		$scope.m.isHome = (curr.templateUrl === 'partials/home.html');
	})
});

app.controller('home', function($scope) {

});

app.controller('projects', function() {

});

app.filter('markdown', function() {
	return function(input) {
		return marked(input || '');
	};
});