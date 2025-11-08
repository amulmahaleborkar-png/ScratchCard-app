const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true },
  password: { type: String, required: true }
});

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
