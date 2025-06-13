const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot be longer than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // This creates the index automatically
      trim: true,
      lowercase: true,
      match: [
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please provide a valid email address",
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Don't return password by default
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-param-reassign,no-underscore-dangle
        delete ret.__v;
        // eslint-disable-next-line no-param-reassign,no-underscore-dangle
        ret.id = ret._id;
        // eslint-disable-next-line no-param-reassign,no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-param-reassign
        delete ret.password;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

// Remove the duplicate index since it's already defined in the schema
// userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
