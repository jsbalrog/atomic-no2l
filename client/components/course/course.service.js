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
					if(data.sections.length > 0) {
						deferred.resolve(data);
					} else {
						data.message = "No enrollments found"
						deferred.reject(data);
					}
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
