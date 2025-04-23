const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

// Set up multer for profile image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where images are stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Middleware to handle single file upload with key "profileImage"
exports.uploadProfileImage = upload.single("profileImage");

// Create User (Signup) - Only Email & Password
exports.createUser = async (req, res) => {
  try {
    const { email, password, fullName, gender, age, height, weight, birthday } =
      req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      fullName: fullName || "",
      gender: gender || "",
      age: age ?? null,
      height: height ?? null,
      weight: weight ?? null,
      birthday: birthday || null,
      profileImage: "", // Default empty
    });

    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Profile (Protected)
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // assuming authentication middleware adds user to req

    const user = await User.findById(userId).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Profile (Including optional Profile Image update)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Build an update object from request body
    const updates = {
      fullName: req.body.fullName,
      gender: req.body.gender,
      age: req.body.age,
      height: req.body.height,
      weight: req.body.weight,
      birthday: req.body.birthday,
      profileImage: req.body.profileImage, // optional field
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Save Profile Image - update user's document with image URL
exports.saveProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Instead of relying on req.file.path,
    // use req.file.filename to build the URL reliably.
    const fullUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    // Update user document in the database with the constructed URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: fullUrl },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.setHeader("Content-Type", "image/jpeg");
    return res.json({
      message: "Image uploaded and user updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error saving profile image:", error);
    res.status(500).json({ error: error.message });
  }
};

// Logout User
exports.logoutUser = (req, res) => {
  try {
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Users (optional)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
