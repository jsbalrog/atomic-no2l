'use strict';

angular.module('meltApp').controller('MyCourseDetailsCtrl', function ($scope, $stateParams, CourseService) {
	if ($stateParams.courseId) {
		CourseService.getCourseDetails($stateParams.courseId).then(function (course) {
			console.log(course);
			if(!course.posts) { course.posts = []; }
			$scope.course = course;
			$scope.course.posts.push({
				_id: 1,
				title: 'Here\'s a great idea',
				content: 'How about we all eat pie?',
				upvotes: 0,
				comments: [
					{_id: 1, user: 'Joe', body: 'Cool post!', upvotes: 0, createdOn: new Date('Mon Sep 07 2014 14:53:22 GMT-0600 (MDT)')},
					{_id: 2, parent: 1, user: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0, createdOn: new Date('Mon Sep 06 2014 14:53:22 GMT-0600 (MDT)')}
				]
			});
			$scope.err = false;
		}, function (course) {
			$scope.course = course;
			$scope.err = true;
			$scope.message = course.message;
		});
	}

	$scope.posts = [];

	$scope.addPost = function() {
		if ($scope.title === '') {
			return;
		}
		$scope.course.posts.push({
			title: $scope.title,
			content: $scope.content,
			upvotes: 0,
			showComments: false,
			createdOn: new Date()
		});
		$scope.title = '';
		$scope.content = '';
	};

	$scope.addComment = function(post, parent, newComment) {
		if(newComment.body === '') { return; }
		console.log(newComment);
		var parentId;
		if(!post.comments) {
			post.comments = [];
			parentId = null;
		} else {
			parentId = parent._id;
		}
		post.comments.push({
			user: 'Fred',
			parent: parentId,
			body: newComment.body,
			upvotes: 0,
			createdOn: new Date()
		});
		console.log(post.comments);
	};

	$scope.incrementUpvotes = function (post) {
		console.log(post);
		post.upvotes += 1;
	};

	$scope.toggleComments = function(post) {
		post.showComments = !post.showComments;
	};
});
