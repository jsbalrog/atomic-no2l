'use strict';

var express = require('express');
var controller = require('./enrollment.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', controller.enroll);
router.get('/:ldsAccountId', controller.getEnrollmentsByUser);

module.exports = router;
