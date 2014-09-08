'use strict';

angular.module('meltApp').factory('Course', function ($resource) {
  return $resource('/api/courses');
})
.factory('CourseService', function($http, $q) {
	var cachedCourse;
  function getCourseDetails(courseId) {
      var deferred = $q.defer();
      $http.get('/api/courses/' + courseId)
          .success(function(data) {
              if(data.sections.length > 0) {
								if(!cachedCourse) {
									cachedCourse = data;
								}
                deferred.resolve(cachedCourse);
              } else {
                  data.message = 'No enrollments found';
                  deferred.reject(data);
              }
          })
          .error(function(data) {
              deferred.reject(data);
          });
      return deferred.promise;
  }

  function getMyCourses(userid) {
    var deferred = $q.defer();
    $http.get('/api/users/' + userid + '/courses')
      .success(function(data) {
        if(data.length > 0) {
					cachedCourse = undefined;
          deferred.resolve(data);
        } else {
          data.message = 'No courses found';
          deferred.reject(data);
        }
      })
      .error(function(data) {
				console.log(data);
        deferred.reject(data);
      });
    return deferred.promise;
  }

	function getCachedCourse() {
		return cachedCourse;
	}

  return {
    getCourseDetails: getCourseDetails,
    getMyCourses: getMyCourses,
		getCachedCourse: getCachedCourse
  };
});
