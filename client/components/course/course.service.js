'use strict';

angular.module('meltApp')
  .factory('Course', function ($resource) {
    return $resource('/api/courses');
	})
	.factory('CourseService', function($http, $q) {
		function getCourseDetails(courseId) {
			var deferred = $q.defer();
			$http.get('/api/courses/' + courseId)
				.success(function(data) {
					console.log(data);
					deferred.resolve(data);
				})
				.error(function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
		}
		
		return {
			getCourseDetails: getCourseDetails
		};
		
  });
