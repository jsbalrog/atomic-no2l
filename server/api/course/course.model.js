var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', index: true },
	content: { type: String },
	parent: { type: mongoose.Schema.ObjectId, ref: 'Comment' },
	createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);

var postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', index: true },
  title: { type: String },
	content: { type: String },
	comments: [commentSchema],
	createdOn: { type: Date, default: Date.now }
});

var courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  orgId: { type: Number, required: true },
  tags: { type: Array, "default": [] },
	posts: [postSchema],
	createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
