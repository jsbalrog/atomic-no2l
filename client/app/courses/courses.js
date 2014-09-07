'use strict';

angular.module('meltApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('courses', {
        url: '/courses',
        templateUrl: 'app/courses/courses.html',
        controller: 'MyCoursesCtrl',
        authenticate: true
      });
  });
