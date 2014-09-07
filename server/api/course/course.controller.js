/* jshint -W079 */

'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Course = require('./course.model');
var Section = require('../section/section.model');
var Promise = require('promise');
var common = require('../common');

// Private functions -----------------------------------------------------------
function coursesReadAllByOrgId(orgId) {
  return new Promise(function(fulfill, reject) {
    if(!orgId) {
      reject({
        "message": "org id required"
      });
    } else {
      Course.find({orgId: orgId}).exec(function (err, courses) {
        if (courses.length < 1) {
          reject({
            "message": "org id not found for: " + orgId
          });
        } else if (err) {
          reject({
            "message": err
          });
        }
        fulfill(courses);
      });
    }
  });
}

function getAllSectionsByCourseId(courseId) {
	return new Promise(function(fulfill, reject) {
		Section.find({course: courseId}).populate('enrollments.user').exec(function(err, sections) {
			if(err) {
				reject({
					"message": err
				});
			}
			fulfill(sections);
		});
	});
}

// Public functions ------------------------------------------------------------
module.exports.coursesReadOne = function(courseId) {
  return new Promise(function(fulfill, reject) {
    if(!courseId) {
      reject({
        "message": "course id required"
      });
    } else {
      Course.findById(courseId).exec(function(err, course) {
        if(!course) {
          reject({
            "message": "course id not found for: " + courseId
          });
        } else if(err) {
          reject({
            "message": err
          });
        } else {
          fulfill(course);
        }
      });
    }
  });
};

module.exports.coursesReadAllByUserId = function(req, res) {
  var returnValue = [];

  if(!req.params.id) {
    common.sendJSONResponse(res, 400, {
      "message": "userId required"
    });
  } else {
    // Get all sections
    Section.find().populate('course').exec(function(err, sections) {
      if(sections.length < 1) {
        common.sendJSONResponse(res, 400, {
          "message": "No sections found!"
        });
      } else if(err) {
        common.sendJSONResponse(res, 400, {
          "message": err
        });
      } else {
        _.forEach(sections, function(section, i) {
          var matchingEnrollments = _.filter(section.enrollments, function(enrollment) {
            return enrollment.user.toString() == req.params.id;
          });
          if(matchingEnrollments && matchingEnrollments.length > 0) {
            returnValue.push(section.course);
          }
        });
        if(returnValue && returnValue.length > 0) {
          common.sendJSONResponse(res, 200, returnValue);
        } else {
          common.sendJSONResponse(res, 400, {
            "message": "no enrollments for user"
          });
        }
      }
    });
  }
}

// Get an org's courses
module.exports.getCoursesByOrgId = function(req, res) {
  var msg = {};
  if(req.params && req.params.orgid) {
    coursesReadAllByOrgId(req.params.orgid).then(function(courses) {
      if(courses.length > 0) {
        common.sendJSONResponse(res, 200, courses);
      } else {
        msg = {"message" : "No courses found" };
        common.sendJSONResponse(res, 400, msg);
      }
    }, function(jsonErrorResponse) {
      common.sendJSONResponse(res, 400, jsonErrorResponse);
    });
  }
};

// Find a course
module.exports.coursesFindOne = function(req, res) {
	if(!req.params.courseId) {
		var msg = {
				"message": "course id is required"
			};
			common.sendJSONResponse(res, 400, msg);
	} else {
		Course.findById(req.params.courseId).exec(function(err, course) {
			if(!course) {
				var msg = {
					"message": "course id not found"
				};
				common.sendJSONResponse(res, 400, msg);
			} else if(err) {
				common.sendJSONResponse(res, 400, err);
			} else {
				common.sendJSONResponse(res, 200, course);
			}
		});
	}
};

module.exports.coursesGetAll = function(req, res) {
  Course.find().exec(function (err, courses) {
    if (courses.length < 1) {
      var msg = {
        "message": "no courses found"
      };
      common.sendJSONResponse(res, 400, msg);
    } else if (err) {
      common.sendJSONResponse(res, 400, err);
    } else {
      common.sendJSONResponse(res, 200, courses);
    }
  });
};

module.exports.coursesGetDetails = function(req, res) {
	if(!req.params.courseId) {
		var msg = {
			"message": "course id is required"
		};
		common.sendJSONResponse(res, 400, msg);
	} else {
		getAllSectionsByCourseId(req.params.courseId).then(function(sections) {
			Course.findById(req.params.courseId).exec(function(err, course) {
				if(!course) {
					var msg = {
						"message": "course id not found"
					};
					common.sendJSONResponse(res, 400, msg);
				} else if(err) {
					common.sendJSONResponse(res, 400, err);
				} else {
					console.log(sections);
					var retVal = {
						"courseId": req.params.courseId,
						"courseName": course.name,
						"orgId": course.orgId,
						"tags": course.tags,
						"sections": sections
					}
					common.sendJSONResponse(res, 200, retVal);
				}
			});
		}, function(jsonErrorResponse) {
			common.sendJSONResponse(res, 400, jsonErrorResponse);
		});
	}
};

// Create new course and set courseId.
module.exports.postCourse = function(req, res) {
  var crs = req.body;
  module.exports.coursesCreate(crs).then(function(user) {
    common.sendJSONResponse(res, 200, user);
  }, function(jsonErrorResponse) {
    common.sendJSONResponse(res, 400, jsonErrorResponse);
  });
};

module.exports.coursesCreate = function(course) {
  return new Promise(function(fulfill, reject) {
    if (!course || !course.name) {
      reject({
        "message": "course name required"
      });
    } else if(!course.orgId) {
      reject({
        "message": "org id required"
      });
    } else {
      // create user
      Course.create({
        name: course.name,
        orgId: course.orgId,
        tags: course.tags
      }, function(err, course) {
        if(err) {
          var msg = { "message": err };
          reject(msg);
        } else {
          fulfill(course);
        }
      });
    }
  });
};
