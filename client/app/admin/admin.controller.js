'use strict';

angular.module('meltApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, Course) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();
    // Use the Course $resource to fetch all courses
    $scope.courses = Course.query();
		
    $scope.deleteUser = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };

  });
