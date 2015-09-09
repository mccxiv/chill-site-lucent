console.log('loaded')

var app = angular.module('lucent-dash', ['ngResource', 'ngSanitize']);

app.controller('main', function($scope, $resource) {

	$scope.m = {
		posts: [],
		post: {},
		status: {}
	};

	fetchList();
	fetchStatus();

	$scope.$watch('m.status', function() {
		setTimeout(function() {
			componentHandler.upgradeElements(document.querySelectorAll('*'));
		}, 10);
	});

	$scope.delete = function(id) {
		if (!confirm('Deleting the post with ID '+id+'.\nAre you sure?')) return;
		$resource('../api/posts/'+id, null, {delete: {method: 'DELETE'}}).delete(function() {
			fetchList();
			$scope.m.post = {};
		});
	};

	$scope.copy = angular.copy;

	$scope.status = function() {
		var status = $scope.m.status;
		if (status.installed === undefined) return '';
		if (!status.installed) return 'need-install';
		if (status.admin) return 'is-admin';
		if (!status.admin) return 'need-login';
	};

	$scope.submit = function() {
		var id = $scope.m.post.id;
		if (!id || !idExists(id)) $resource('../api/posts/').save($scope.m.post, fetchList);
		else $resource('../api/posts/', null, {put: {method: 'PUT'}}).put($scope.m.post, fetchList);
	};

	$scope.submitVerb = function(id) {
		return (!id || !idExists(id))? 'create' : 'update';
	};

	function fetchList() {
		$scope.m.posts = $resource('../api/posts/', null, {get: {isArray: true}}).get();
	}

	function fetchStatus() {
		$scope.m.status = $resource('../chill/status/').get();
	}

	function idExists(id) {
		var yep = false;
		$scope.m.posts.forEach(function(post) {
			if (post.id === id) yep = true;
		});
		return yep;
	}
});

app.filter('markdown', function() {
	return function(input) {
		return marked(input || '');
	};
});