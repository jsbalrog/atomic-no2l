'use strict';

angular.module('meltApp').controller('CoursesCtrl', function($scope, $stateParams, $state, CourseService) {

	$scope.options = [
		1,
		1111,
		2222,
		3333
	];
	
	CourseService.getCourseDetails($stateParams.courseId).then(function(course) {
		console.log(course);
		$scope.course = course;
		$scope.err = false;
	}, function(course) {
		$scope.course = course;
		$scope.err = true;
		$scope.message = course.message;
	});

	$scope.saveOrg = function(org) {
		$scope.course.orgId = org;
	};

	$scope.cancelCourseEdit = function() {
		console.log("cancel");
		$state.go("admin");
	};
});
