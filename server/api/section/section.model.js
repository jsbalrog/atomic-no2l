var mongoose = require('mongoose');

var enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', index: true },
  active: { type: Boolean, default: true },
  role: { type: String },
	createdOn: { type: Date, default: Date.now }
});

var sectionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.ObjectId, ref: 'Course' },
	begin: { type: Date },
  enrollments: [enrollmentSchema],
	createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Section', sectionSchema);
