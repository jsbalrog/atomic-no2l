/* jshint -W079 */
'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Course = require('../course/course.model');
var CourseController = require('../course/course.controller');
var Section = require('../section/section.model');
var uzers = require('../user/user.model');
var Promise = require('promise');
var common = require('../common');

// Private functions -----------------------------------------------------------------------------------
function enrollmentsReadAllByUserId(userId) {
  return new Promise(function(fulfill, reject) {
    if(!userId) {
      reject({
        "message": "userId required"
      });
    } else {
      var user = {};
      uzers.usersFindById(userId).then(function(u) {
        var returnValue = {
          _id: u._id,
          ldsAccountId: u.ldsAccountId,
          userName: u.userName,
          firstName: u.firstName,
          middleName: u.middleName,
          lastName: u.lastName,
          email: u.email,
          enrollments: []
        };
        // Get all sections
        Section.find().exec(function(err, sections) {
          if(sections.length < 1) {
            reject({
              "message": "No sections found!"
            });
          } else if(err) {
            reject({
              "message": err
            });
          } else {
            _.forEach(sections, function(section, i) {
              var matchingEnrollments = _.filter(section.enrollments, function(enrollment) { return enrollment.user.toString() === u._id.toString(); });
              if(matchingEnrollments && matchingEnrollments.length > 0) {
                CourseController.coursesReadOne(section.course).then(function(course) {
                  _.forEach(matchingEnrollments, function(enrollment) {
                    var e = {};
                    e._id = enrollment._id;
                    e.sectionId = section._id;
                    e.courseId = section.course;
                    e.courseName = course.name;
                    e.roleId = enrollment.role;
                    e.active = enrollment.active;
                    returnValue.enrollments.push(e);
                    if(common.done(sections, i)) {
                      fulfill(returnValue);
                    }
                  });
                }, function(msg) {
                  reject(msg);
                });
              }
            });
          }
        });
      }, function(msg) {
        console.log("Rejecting. Reason:", msg.message);
        reject(msg);
      });
    }
  });
}

function enrollmentsReadAllByLdsAccountId(ldsAccountId) {
  return new Promise(function(fulfill, reject) {
    if(!ldsAccountId) {
      reject({
        "message": "ldsAccountId required"
      });
    } else {
      var user = { ldsAccountId: ldsAccountId };
      uzers.usersReadOneByLdsAccountId(user).then(function(u) {
        var returnValue = {
          _id: u._id,
          ldsAccountId: u.ldsAccountId,
          userName: u.userName,
          firstName: u.firstName,
          middleName: u.middleName,
          lastName: u.lastName,
          email: u.email,
          enrollments: []
        };
        // Get all sections
        Section.find().exec(function(err, sections) {
          if(sections.length < 1) {
            reject({
              "message": "No sections found!"
            });
          } else if(err) {
            reject({
              "message": err
            });
          } else {
            _.forEach(sections, function(section, i) {
              var matchingEnrollments = _.filter(section.enrollments, function(enrollment) { return enrollment.user.toString() === u._id.toString(); });
              if(matchingEnrollments && matchingEnrollments.length > 0) {
                CourseController.coursesReadOne(section.course).then(function(course) {
                  _.forEach(matchingEnrollments, function(enrollment) {
                    var e = {};
                    e._id = enrollment._id;
                    e.sectionId = section._id;
                    e.courseId = section.course;
                    e.courseName = course.name;
                    e.roleId = enrollment.role;
                    e.active = enrollment.active;
                    returnValue.enrollments.push(e);
                    if(common.done(sections, i)) {
                      fulfill(returnValue);
                    }
                  });
                }, function(msg) {
                  reject(msg);
                });
              }
            });
          }
        });
      }, function(msg) {
        console.log("Rejecting. Reason:", msg.message);
        reject(msg);
      });
    }
  });
}

function sectionsCreate(courseId) {
  return new Promise(function (fulfill, reject) {
    Course.findById(courseId).exec(function (err, course) {
      if (!course) {
        var msg = { "message": "courseId not found" };
        reject(msg);
      }
      else {
        Section.create({
          course: course,
          enrollments: []
        }, function (err, section) {
          if (err) {
            var msg = { "message": err };
            reject(msg);
          }
          else {
            fulfill(section);
          }
        });
      }
    });
  });
}

function addUserProperty(users, user, result) {
  var usr = _.findWhere(users, { ldsAccountId : user.ldsAccountId });
  usr.result = result;
  return usr;
}

function getSectionEnrollments(sectionId) {
  return new Promise(function (fulfill, reject) {
    // Retrieve enrollments for the specified section
    Section.findById(sectionId)
      .select('enrollments')
      .exec(function (err, section) {
        if (!section) {
          var msg = { "message": "sectionId not found" };
          reject(msg);
        }
        else {
          fulfill(section);
        }
      });
  });
}

function enrollmentsCreate(section, user, role) {
  return new Promise(function (fulfill, reject) {
    section.enrollments.push({
      user: user,
      active: true,
      role: role
    });
    // Save the parent section document
    section.save(function (err, section) {
      if (err) {
        var msg = { "enrolled": false, "message": err };
        reject(msg);
      }
      else {
        fulfill(section);
      }
    });
  });
}

// Get a user's enrollments
module.exports.getEnrollmentsByUser = function(req, res) {
  var msg = {};
  if(req.params && req.params.ldsaccountid) {
    enrollmentsReadAllByLdsAccountId(req.params.ldsaccountid).then(function(user) {
      if(user.enrollments && user.enrollments.length > 0) {
        common.sendJSONResponse(res, 200, user);
      } else {
        msg = {"message" : "No enrollments found" };
        common.sendJSONResponse(res, 200, msg);
      }
    }, function(jsonErrorResponse) {
      common.sendJSONResponse(res, 400, jsonErrorResponse);
    });
  }
};

module.exports.enroll = function(req, res) {
  var users = req.body.users;
  var msg = {};
  var jsonSuccessResponse = req.body;
  jsonSuccessResponse.users = [];

  if(req.body.courseId) {
    _.forEach(users, function(user, i) {
      uzers.usersReadOneByLdsAccountId(user).then(function(usr) {
        if(req.body.sectionId) {
          getSectionEnrollments(req.body.sectionId).then(function(section) {
            if(!section.enrollments || section.enrollments.length < 1) {
              enrollmentsCreate(section, usr, user.role).then(function() {
                msg = { "enrolled": true };
                jsonSuccessResponse.users.push(addUserProperty(users, usr, msg));
                if(common.done(users, i)) {
                  common.sendJSONResponse(res, 200, jsonSuccessResponse);
                }
              }, function(jsonErrorResponse) {
                if(common.done(users, i)) {
                  common.sendJSONResponse(res, 400, jsonErrorResponse);
                }
              });
            } else {
              // check if user already has an enrollment for this section
              var foundEnrollments = _.find(section.enrollments, function(enrollment) {
                return enrollment.user.toString() === usr._id.toString();
              });
              if(foundEnrollments) {
                msg = { "enrolled": false, "message": "user already enrolled in section" };
                jsonSuccessResponse.users.push(addUserProperty(users, usr, msg));
                if(common.done(users, i)) {
                  common.sendJSONResponse(res, 200, jsonSuccessResponse);
                }
              } else {
                enrollmentsCreate(section, usr, user.role).then(function() {
                  msg = { "enrolled": true };
                  jsonSuccessResponse.users.push(addUserProperty(users, usr, msg));
                  if(common.done(users, i)) {
                    common.sendJSONResponse(res, 200, jsonSuccessResponse);
                  }
                }, function(jsonErrorResponse) {
                  if(common.done(users, i)) {
                    common.sendJSONResponse(res, 400, jsonErrorResponse);
                  }
                });
              }
            }
          }, function(jsonErrorResponse) {
            if(common.done(users, i)) {
              common.sendJSONResponse(res, 200, jsonErrorResponse);
            }
          });
        } else {
          // No sectionId specified--create a new section for the course and enroll the user
          sectionsCreate(req.body.courseId).then(function(section) {
            // enroll the user in the section
            enrollmentsCreate(section, usr, user.role).then(function() {
              msg = { "enrolled": true };
              jsonSuccessResponse.sectionId = section. _id;
              jsonSuccessResponse.users.push(addUserProperty(users, usr, msg));
              if(common.done(users, i)) {
                common.sendJSONResponse(res, 200, jsonSuccessResponse);
              }
            }, function(jsonErrorResponse) {
              if(common.done(users, i)) {
                common.sendJSONResponse(res, 400, jsonErrorResponse);
              }
            });
          }, function(jsonErrorResponse) {
            if(common.done(users, i)) {
              common.sendJSONResponse(res, 200, jsonErrorResponse);
            }
          });
        }
      }, function(jsonErrorResponse) {
        if(common.done(users, i)) {
          common.sendJSONResponse(res, 400, jsonErrorResponse);
        }
      });
    });
  } else {
    msg = { "message": "courseId is required" };
    common.sendJSONResponse(res, 400, msg);
  }
};
