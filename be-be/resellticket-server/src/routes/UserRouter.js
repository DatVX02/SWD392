const express = require("express");
const bodyParser = require("body-parser");
const userRouter = express.Router();
userRouter.use(bodyParser.json());
const {
  registerUser,
  getUsers,
  getUserById,
  updateUsers,
  deleteUsers,
  currentUser,
  changePassword,
  checkOldPassword,
  getStaffs,
  statisticsAccountByStatus,
  searchAccountByEmail,
  banAccountByAdmin,
  sortAccount,
  filterAccount,
  statisticProfitByMonth,
  registerStaff,
  getStaffById,
  updateStaff,
} = require("../app/controllers/UserController");
const {
  validateToken,
  validateTokenAdmin,
} = require("../app/middleware/validateTokenHandler");

userRouter.route("/register").post(registerUser);

userRouter.route("/register/staff").post(validateTokenAdmin, registerStaff);

userRouter.get("/staffs", validateTokenAdmin, getStaffs);

userRouter.get("/staff/:id", validateTokenAdmin, getStaffById);

userRouter.put("/staff/:id", validateTokenAdmin, updateStaff);

userRouter.use(validateToken);

//Router for Admin to getAllUsers
userRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })

  .get(getUsers);

userRouter.get("/current", currentUser);

userRouter.route("/sortAccount").get(validateTokenAdmin, sortAccount);

userRouter.route("/filterAccount").get(validateTokenAdmin, filterAccount);

userRouter
  .route("/statisticsAccount")
  .get(validateTokenAdmin, statisticsAccountByStatus);

userRouter
  .route("/statisticProfitByMonth")
  .get(validateTokenAdmin, statisticProfitByMonth);

userRouter
  .route("/searchAccountByEmail")
  .get(validateTokenAdmin, searchAccountByEmail);

//Router for getUserByID, updateUser, deleteUser
userRouter
  .route("/:id")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })

  .get(getUserById)

  .put(updateUsers)

  .delete(deleteUsers);

userRouter.route("/checkOldPassword/:id").post(checkOldPassword);

userRouter.route("/changePassword/:id").put(changePassword);

userRouter
  .route("/banAccountByAdmin/:account_id")
  .patch(validateTokenAdmin, banAccountByAdmin);

module.exports = userRouter;
