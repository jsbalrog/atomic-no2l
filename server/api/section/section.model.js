var mongoose = require('mongoose');

var enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', index: true },
  active: { type: Boolean, default: true },
  role: { type: Number }
});

var sectionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.ObjectId, ref: 'Course' },
  enrollments: [enrollmentSchema]
});

module.exports = mongoose.model('Section', sectionSchema);