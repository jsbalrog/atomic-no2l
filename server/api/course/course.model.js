var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  orgId: { type: Number, required: true },
  tags: { type: Array, "default": [] }
});

module.exports = mongoose.model('Course', courseSchema);