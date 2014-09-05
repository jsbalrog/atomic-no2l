'use strict';

angular.module('meltApp').controller('CoursesCtrl', function($scope, $stateParams, $state, $modal, CourseService, UserService) {

	$scope.options = [
		'Priesthood',
		1111,
		'CES'
	];


	UserService.getAllUsers().then(function(users) {
		$scope.users = users;
		CourseService.getCourseDetails($stateParams.courseId).then(function(course) {
			console.log(course);
			$scope.course = course;
			$scope.availableUsers = UserService.getUsersNotInCourse(course);
			$scope.err = false;
		}, function(course) {
			$scope.course = course;
			$scope.err = true;
			$scope.message = course.message;
		});
	})

	$scope.saveOrg = function(org) {
		$scope.course.orgId = org;
	};

	$scope.cancelCourseEdit = function() {
		console.log('cancel');
		$state.go('admin');
	};

	$scope.addEnrollment = function() {
		var modalInstance = $modal.open({
      templateUrl: 'app/courses/add-enrollment.modal.html',
      controller: function ($scope, $modalInstance, availableUsers, course) {
				$scope.users = availableUsers;
				$scope.course = course;
				$scope.availableSections = _.filter(course.sections, function(section) {
					return moment(section.begin) > moment();
				});
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
        availableUsers: function () {
          return $scope.availableUsers;
        },
				course: function() {
					return $scope.course;
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
