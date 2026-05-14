import bcryptjs from "bcryptjs";
import User from "../model/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUpController = async (req, res, next) => {
  const { username, email, password, role } = req.body; // 🔥 role add kiya

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashPassword = bcryptjs.hashSync(password, 10);

  //  Role validation: Sirf "author" ya "user" allow karo (admin manually assign hoga)
  let userRole = "user";
  if (role && (role === "author" || role === "user")) {
    userRole = role;
  }

  const newUser = new User({
    username,
    email,
    password: hashPassword,
    role: userRole, //  Role save karo
    isAdmin: userRole === "admin" ? true : false, // 🔥 isAdmin sync with role
  });

  try {
    await newUser.save();
    res.json("User sign up successfully");
  } catch (error) {
    next(error);
  }
};

// ================================= sign in controller =================================
export const signInController = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All field are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid Password"));
    }

    const token = jwt.sign(
      {
        id: validUser._id,
        isAdmin: validUser.isAdmin,
        role: validUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } //  Add token expiry
    );

    const { password: pass, ...rest } = validUser._doc;
    
    //  FIXED COOKIE SETTING 
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", //  true for HTTPS
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //  CRITICAL
        maxAge: 7 * 24 * 60 * 60 * 1000, //  7 days
        path: "/", //  Available on all routes
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// ====================================== google ===================================

export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  try {
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      const { password, ...rest } = user._doc;
      
      //  FIXED COOKIE SETTINGS
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        })
        .json(rest);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashPassword = bcryptjs.hashSync(generatePassword, 10);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashPassword,
        profilePicture: googlePhotoUrl,
        role: "user",
        isAdmin: false,
      });

      await newUser.save();

      const token = jwt.sign(
        {
          id: newUser._id,
          isAdmin: newUser.isAdmin,
          role: newUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      const { password, ...rest } = newUser._doc;
      
      //  FIXED COOKIE SETTINGS
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// ====================================== Update User Role ===================================

export const updateUserRole = async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body; // "user", "author", "admin"

  // Check if requester is admin
  if (req.user.role !== "admin") {
    return next(errorHandler(403, "Only admin can update user roles"));
  }

  // Validate role
  const allowedRoles = ["user", "author", "admin"];
  if (!allowedRoles.includes(role)) {
    return next(errorHandler(400, "Invalid role"));
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role: role,
        isAdmin: role === "admin" ? true : false,
      },
      { new: true },
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
