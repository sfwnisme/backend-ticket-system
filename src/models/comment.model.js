const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isSolution: {
    type: Boolean,
    default: false
  },
},
  {
    timestamps: true
  }
);

commentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;