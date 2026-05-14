import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV3pzD9BQ-2ZEpsQHGuufhTmDdR7H6S73qpg&s",
    },
    role: {
      type: String,
      enum: ["user", "author", "admin"],
      default: "user",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// 🔥 Virtual or helper method to check if user is author
userSchema.methods.isAuthor = function () {
  return this.role === "author" || this.role === "admin";
};

userSchema.methods.isAdminUser = function () {
  return this.role === "admin";
};

const User = mongoose.model("User", userSchema);
export default User;
