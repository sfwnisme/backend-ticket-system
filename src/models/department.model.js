const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    // unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
}, {
  timestamps: true,
});

departmentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;