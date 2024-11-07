const express = require("express");
const authRouter = express.Router();
const {
  login,
  loginGoogle,
  refresh,
  logout,
} = require("../app/controllers/AuthController");
const loginLimiter = require("../app/middleware/loginLimiter");

authRouter.route("/login").post(loginLimiter, login);

authRouter.route("/refresh").get(refresh);

authRouter.route("/logout").get(logout);

module.exports = authRouter;
