'use strict';

angular.module('meltApp').filter('readableDate', function() {
	return function(input, format) {
		return moment(input).format(format);
	};
});
