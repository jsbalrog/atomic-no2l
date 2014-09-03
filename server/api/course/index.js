'use strict';

var express = require('express');
var controller = require('./course.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.coursesGetAll);
router.get('/:courseId', controller.coursesGetDetails);

module.exports = router;
