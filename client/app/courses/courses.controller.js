'use strict';

angular.module('meltApp').controller('CoursesCtrl', function($scope, $stateParams, CourseService) {
  $scope.msg = 'hello courses';
	
	CourseService.getCourseDetails($stateParams.courseId).then(function(course) {
		$scope.course = course;
	}, function(data) {
		console.log(data);
		$scope.err = true;
		$scope.message = data.message;
	});
});
