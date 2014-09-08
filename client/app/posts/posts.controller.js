'use strict';

angular.module('meltApp').controller('PostsCtrl', function($scope, CourseService) {
	$scope.post = CourseService.getCachedPost();
});
