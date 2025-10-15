import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const UserSchema = new mongoose.Schema({
  User: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user',
  },
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
  },
});

// method to pre save hook for pw hashing
UserSchema.pre('save', async function (next) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

UserSchema.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};
UserSchema.virtual('fullname').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
export default mongoose.model('User', UserSchema);
