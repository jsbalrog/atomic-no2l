'use strict';

angular.module('meltApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      })
			.state('admin.courses', {
				url: '/courses/:courseId',
				templateUrl: 'app/courses/courses.detail.html',
				controller: 'CoursesCtrl'
			});
  });
