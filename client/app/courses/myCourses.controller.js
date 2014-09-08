'use strict';

angular.module('meltApp').controller('MyCoursesCtrl', function($scope, Auth, CourseService) {
  Auth.getCurrentUser().$promise.then(function(user) {
    CourseService.getMyCourses(user._id).then(function(courses) {
      $scope.myCourses = courses;
			$scope.err = false;
    }, function(response) {
			$scope.err = true;
			$scope.message = response.message;
		});
  });
});
