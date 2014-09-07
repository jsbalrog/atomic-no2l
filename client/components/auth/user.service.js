'use strict';

angular.module('meltApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  }).factory('UserService', function($http, $q) {
		var cachedUsers = [];

		function getAllUsers() {
			var deferred = $q.defer();
			$http.get('/api/users').success(function(data) {
				console.log(data);
				cachedUsers = data;
				deferred.resolve(data);
			});
			return deferred.promise;
		}

		function getUsersNotInCourse(course) {
			var retVal = [],
					usersInCourse = [];
			_.each(course.sections, function(section) {
				_.each(section.enrollments, function(enrollment) {
					usersInCourse.push(enrollment.user);
				});
			});
			var uinc = _.uniq(usersInCourse, true);

			var bIds = _.pluck(uinc, '_id');

			retVal = _.filter(cachedUsers, function(el) { return !_.contains(bIds, el._id); });

			return retVal;
		}

		return {
			getAllUsers: getAllUsers,
			getUsersNotInCourse: getUsersNotInCourse
		};

  });
