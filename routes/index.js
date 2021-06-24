const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  updateProfile,
  getUser,
  getUsers,
} = require("../controllers/users");

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/", getUsers);

router.route("/:id").put(updateProfile).get(getUser);

module.exports = router;
