const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.Controllers");
const authMiddleware = require("../middlewares/auth.middleware"); // authentication middleware

// Public routes
router.post("/signup", UserController.createUser);
router.post("/login", UserController.loginUser);

// Protected routes (authentication required)
router.post("/logout", authMiddleware, UserController.logoutUser);
router.get("/profile", authMiddleware, UserController.getProfile);
router.put("/profile", authMiddleware, UserController.updateProfile);

// Upload profile image (protected)
// This route uses the multer middleware to handle file uploads and then updates the user document.
router.post(
  "/profile/upload",
  authMiddleware,
  UserController.uploadProfileImage,
  UserController.saveProfileImage
);

// Optionally: Get all users (protected)
router.get("/users", UserController.getUsers);

// Delete user (protected)
router.delete("/user/:id", authMiddleware, UserController.deleteUser);

module.exports = router;
