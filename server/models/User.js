const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  password: String,
  role: String,
  googleId: String,
  avatar: String,
  joinedDateFormatted: String,
  lastUpdatedFormatted: String,
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

UserSchema.virtual('joinedDate').get(function () {
  if (!this.createdAt) return null;
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

UserSchema.pre('save', function (next) {
  if (this.isNew) {
    this.joinedDateFormatted = this.createdAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  this.lastUpdatedFormatted = this.updatedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  next();
});

UserSchema.virtual('lastUpdatedDate').get(function () {
  if (!this.updatedAt) return null;
  return this.updatedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

UserSchema.virtual('joinedShortDate').get(function () {
  return this.createdAt ? this.createdAt.toLocaleDateString() : null;
});

module.exports = mongoose.model("User", UserSchema);