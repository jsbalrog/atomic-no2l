var mongoose = require('mongoose');

var roleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roleId: { type: Number, required: true }
});

mongoose.model('Role', roleSchema);