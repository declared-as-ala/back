/* -------------------------------------------------------------------------- */
/*  routes/user.routes.js                                                     */
/* -------------------------------------------------------------------------- */
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.Controllers");
const authMiddleware = require("../middlewares/auth.middleware");

/* ---------- Public ---------- */
router.post("/signup", UserController.createUser);
router.post("/login", UserController.loginUser);

/* ---------- Protected (auth) ---------- */
router.post("/logout", authMiddleware, UserController.logoutUser);

router.get("/profile", authMiddleware, UserController.getProfile);
router.put("/profile", authMiddleware, UserController.updateProfile);

router.post(
  "/profile/upload",
  authMiddleware,
  UserController.uploadProfileImage,
  UserController.saveProfileImage
);

/* Optional admin / debug */
router.get("/users", UserController.getUsers);
router.delete("/user/:id", authMiddleware, UserController.deleteUser);

module.exports = router;
