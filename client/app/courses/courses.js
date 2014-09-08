'use strict';

angular.module('meltApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('courses', {
        url: '/my-courses',
        templateUrl: 'app/courses/my-courses.html',
        controller: 'MyCoursesCtrl',
        authenticate: true
      })
			.state('my-course-detail', {
				url: '/my-courses/:courseId',
				templateUrl: 'app/courses/my-courses.detail.html',
				controller: 'MyCourseDetailsCtrl'
			})
			.state('posts', {
				url: '/posts/{id}',
				templateUrl: 'posts.html',
				controller: 'PostsCtrl'
			});
  });
