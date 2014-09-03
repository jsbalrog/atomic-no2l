'use strict';

angular.module('meltApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('enrollments', {
        url: '/enrollments',
        templateUrl: 'app/enrollments/enrollments.html',
        controller: 'EnrollmentsCtrl',
        authenticate: true
      });
  });
