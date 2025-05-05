/* -------------------------------------------------------------------------- */
/*  controllers/user.controller.js                                            */
/* -------------------------------------------------------------------------- */
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

/* ------------------------------ Multer setup ------------------------------ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });
exports.uploadProfileImage = upload.single("profileImage");

/* ----------------------------- JWT secret key ----------------------------- */
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

/* ------------------------------- Helpers ---------------------------------- */
const toFileName = (value = "") =>
  value.startsWith("http") ? value.split("/").pop() : value;

/* -------------------------------------------------------------------------- */
/*  AUTH – Signup                                                             */
/* -------------------------------------------------------------------------- */
exports.createUser = async (req, res) => {
  try {
    const { email, password, fullName, gender, age, height, weight, birthday } =
      req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ error: "Email already in use" });

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
      profileImage: "", // file name only
    });

    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*  AUTH – Login                                                              */
/* -------------------------------------------------------------------------- */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*  PROFILE – Get                                                             */
/* -------------------------------------------------------------------------- */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const obj = user.toObject();
    obj.profileImage = toFileName(obj.profileImage); // filename only
    res.json({ user: obj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*  PROFILE – Update (body JSON)                                              */
/* -------------------------------------------------------------------------- */
exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      fullName: req.body.fullName,
      gender: req.body.gender,
      age: req.body.age,
      height: req.body.height,
      weight: req.body.weight,
      birthday: req.body.birthday,
    };

    if (req.body.profileImage)
      updates.profileImage = toFileName(req.body.profileImage);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*  PROFILE – Upload image (multipart)                                        */
/* -------------------------------------------------------------------------- */
exports.saveProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileName = req.file.filename; // keep only the file name

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: fileName },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Image uploaded", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*  OTHER endpoints (logout / delete / list)                                  */
/* -------------------------------------------------------------------------- */
exports.logoutUser = (req, res) => res.json({ message: "Logout successful" });

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
