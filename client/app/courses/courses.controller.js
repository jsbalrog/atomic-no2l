'use strict';

angular.module('meltApp').controller('CoursesCtrl', function($scope, $stateParams, $state, $modal, CourseService, User) {

	$scope.options = [
		'Priesthood',
		1111,
		'CES'
	];
	
	$scope.users = User.query();

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

	$scope.addEnrollment = function(course) {
		var modalInstance = $modal.open({
      templateUrl: 'app/courses/add-enrollment.modal.html',
      controller: function ($scope, $modalInstance, users) {
				$scope.users = users;
				$scope.selected = {}; // Initially nothing selected by default

				$scope.ok = function () {
					$modalInstance.close($scope.selected.user);
				};

				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
			},
      size: 'lg',
      resolve: {
        users: function () {
          return $scope.users;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
	};
});
