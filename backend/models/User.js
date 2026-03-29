/* ============================================================
   User Model - MongoDB with Mongoose
   ============================================================ */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const User = mongoose.model('User', userSchema);

// Static methods for easy use
userSchema.statics.sanitize = function(user) {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : user;
  const { passwordHash, __v, ...sanitized } = obj;
  return sanitized;
};

module.exports = User;