const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment/moment");
const RoleEnum = require("../../enum/RoleEnum");
const FilterByEnum = require("../../enum/FilterByEnum");
const FilterTypeEnum = require("../../enum/FilterTypeEnum");
const SortByEnum = require("../../enum/SortByEnum");
const SortTypeEnum = require("../../enum/SortTypeEnum");

//@desc Register New user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { fullName, phone_number, email, password } = req.body;
    if (
      fullName === undefined ||
      phone_number === undefined ||
      email === undefined ||
      password === undefined
    ) {
      res.status(400);
      throw new Error("All field not be empty!");
    }
    const userEmailAvailable = await User.findOne({ email });
    if (userEmailAvailable) {
      res.status(400);
      throw new Error("This email is exited in the system!");
    }

    if (phone_number !== "") {
      const pattern = /^0\d{9}$/;
      if (!pattern.test(phone_number)) {
        res.status(400);
        throw new Error(
          "phone_number must have 10 numbers and start with 0 number!"
        );
      }
      const userPhoneNumberAvailable = await User.findOne({ phone_number });
      if (userPhoneNumberAvailable) {
        res.status(400);
        throw new Error("This Phone Number is exited in the system!");
      }
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      phone_number,
      email,
      password: hashedPassword,
      role: RoleEnum.CUSTOMER,
    });
    if (!user) {
      res.status(400);
      throw new Error("User data is not Valid!");
    }
    const accessToken = jwt.sign(
      {
        user: {
          fullName: user.fullName,
          email: user.email,
          roleName: user.role,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      {
        user: {
          fullName: user.fullName,
          email: user.email,
          roleName: user.role,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Register New user
//@route POST /api/users/register
//@access public
const registerStaff = asyncHandler(async (req, res, next) => {
  try {
    const { fullName, gender, dob, address, phone_number, email, password } =
      req.body;
    if (
      fullName === undefined ||
      phone_number === undefined ||
      email === undefined ||
      password === undefined
    ) {
      res.status(400);
      throw new Error("All field not be empty!");
    }
    const userEmailAvailable = await User.findOne({ email });
    if (userEmailAvailable) {
      res.status(400);
      throw new Error("This email is exited in the system!");
    }

    if (phone_number !== "") {
      const pattern = /^0\d{9}$/;
      if (!pattern.test(phone_number)) {
        res.status(400);
        throw new Error(
          "phone_number must have 10 numbers and start with 0 number!"
        );
      }
      const userPhoneNumberAvailable = await User.findOne({ phone_number });
      if (userPhoneNumberAvailable) {
        res.status(400);
        throw new Error("This phone number is exited in the system!");
      }
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      phone_number,
      email,
      password: hashedPassword,
      role: RoleEnum.STAFF,
    });
    if (!user) {
      res.status(400);
      throw new Error("User data is not Valid!");
    }
    const accessToken = jwt.sign(
      {
        user: {
          fullName: user.fullName,
          email: user.email,
          roleName: user.role,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      {
        user: {
          fullName: user.fullName,
          email: user.email,
          roleName: user.role,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Get all users
//@route GET /api/users
//@access private
const getUsers = asyncHandler(async (req, res, next) => {
  try {
    if (
      req.user.roleName !== RoleEnum.ADMIN &&
      req.user.roleName !== RoleEnum.STAFF
    ) {
      res.status(403);
      throw new Error(
        "Chỉ có Admin và Staff có quyền truy xuất thông tin tất cả tài khoản"
      );
    }
    let users = await User.find().exec();
    if (!users) {
      res.status(400);
      throw new Error(
        "Có lỗi xảy ra khi Admin truy xuất thông tin tất cả tài khoản"
      );
    }
    users = users.filter((user) => user.role !== RoleEnum.ADMIN);
    res.status(200).json(users);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Get all users
//@route GET /api/users
//@access private
const getStaffs = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.roleName !== RoleEnum.ADMIN) {
      res.status(403);
      throw new Error(
        "Chỉ có Admin có quyền truy xuất thông tin tất cả tài khoản"
      );
    }
    const users = await User.find({ role: RoleEnum.STAFF }).exec();
    if (!users) {
      res.status(400);
      throw new Error(
        "Có lỗi xảy ra khi Admin truy xuất thông tin tài khoản staff"
      );
    }
    res.status(200).json(users);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Get all users
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found!");
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Get user
//@route GET /api/users/:id
//@access private
const getUserById = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      res.status(404);
      throw new Error("User Not Found!");
    }
    const userEmail = user.email;
    if (
      !(
        req.user.email === userEmail ||
        req.user.roleName === RoleEnum.ADMIN ||
        req.user.roleName === RoleEnum.STAFF
      )
    ) {
      res.status(403);
      throw new Error("You don't have permission to get user's profile");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(res.statusCode).send(error.message || "Internal Server Error");
  }
});

//@desc Get user
//@route GET /api/users/:id
//@access private
const getStaffById = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.roleName !== RoleEnum.ADMIN) {
      res.status(403);
      throw new Error(
        "Chỉ có Admin có quyền truy xuất thông tin tất cả tài khoản"
      );
    }
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      res.status(404);
      throw new Error("User Not Found!");
    }
    if (!(req.user.roleName === RoleEnum.ADMIN)) {
      res.status(403);
      throw new Error("You don't have permission to get user's profile");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(res.statusCode).send(error.message || "Internal Server Error");
  }
});

const updateStaff = async (req, res) => {
  try {
    if (req.user.roleName !== RoleEnum.ADMIN) {
      res.status(403);
      throw new Error(
        "Chỉ có Admin có quyền truy xuất thông tin tất cả tài khoản"
      );
    }
    // Tìm kiếm nhân viên theo ID
    const staff = await User.findById(req.params.id);
    if (!staff) {
      res.status(404);
      throw new Error("Staff not found");
    }

    // Lấy các thông tin từ body của request
    const { fullName, phone_number, dob, email, gender } = req.body;

    const isChangePhoneNumber = staff.phone_number !== phone_number;
    if (isChangePhoneNumber) {
      if (phone_number !== "") {
        const userPhoneNumberAvailable = await User.findOne({ phone_number });
        if (userPhoneNumberAvailable) {
          res.status(400);
          throw new Error(
            "User has already registered with this phone number!"
          );
        }
      }
    }

    // Cập nhật các thông tin của nhân viên
    staff.fullName = fullName || staff.fullName;
    staff.phone_number = phone_number || staff.phone_number;
    staff.dob = dob || staff.dob;
    staff.email = email || staff.email;
    staff.gender = gender || staff.gender;

    // Lưu lại thông tin đã cập nhật
    const updatedStaff = await staff.save();
    res.status(200).json(updatedStaff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//@desc Update user
//@route PUT /api/users/:id
//@access private
//@desc Update user
//@route PUT /api/users/:id
//@access private
const updateUsers = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User Not Found!");
    }

    const { fullName, phone_number, dob, email, gender } = req.body;

    // Kiểm tra quyền hạn của người dùng
    if (
      req.user.email !== user.email &&
      req.user.roleName !== RoleEnum.STAFF &&
      req.user.roleName !== RoleEnum.ADMIN
    ) {
      res.status(403);
      throw new Error("You don't have permission to update user's profile");
    }

    // Kiểm tra và cập nhật số điện thoại nếu thay đổi
    const isChangePhoneNumber = user.phone_number !== phone_number;
    if (isChangePhoneNumber) {
      if (phone_number !== "") {
        const userPhoneNumberAvailable = await User.findOne({ phone_number });
        if (userPhoneNumberAvailable) {
          res.status(400);
          throw new Error(
            "User has already registered with this phone number!"
          );
        }
      }
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        phone_number,
        dob,
        email,
        gender,
      },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Delete user
//@route DELETE /api/users/:id
//@access private
const deleteUsers = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User Not Found!");
    }
    if (req.user.roleName !== RoleEnum.ADMIN) {
      res.status(403);
      throw new Error("You don't have permission to update user's profile");
    }
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json(user);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc User change password
//@route GET /api/users/checkOldPassword/:id
//@access private
const checkOldPassword = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const { password } = req.body;
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      res.status(401);
      throw new Error("Old password is incorrect");
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc User change password
//@route GET /api/users/changePassword/:id
//@access private
const changePassword = asyncHandler(async (req, res, next) => {
  try {
    const investor_id = req.params.id;
    const user = await User.findById(investor_id);
    if (!user) {
      res.status(404);
      throw new Error("User not Found!");
    }
    if (req.user.id !== investor_id) {
      res.status(403);
      throw new Error(
        "You don't have permission to change another user's password!"
      );
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400);
      throw new Error("All fields must be filled!");
    }

    // Verify the current password
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      res.status(400);
      throw new Error("Current password is incorrect!");
    }

    // Check if newPassword and confirmPassword match (this can be done on the frontend)
    if (newPassword !== confirmPassword) {
      res.status(400);
      throw new Error("New password and confirm password do not match!");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (!hashedPassword) {
      res.status(500);
      throw new Error("Error hashing the new password!");
    }

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const statisticsAccountByStatus = asyncHandler(async (req, res) => {
  try {
    let accounts = await User.find();
    if (!accounts || accounts.length === 0) {
      return null;
    }
    accounts = accounts.filter((account) => account.role !== RoleEnum.ADMIN);
    const tmpCountData = {
      Active: 0,
      InActive: 0,
    };

    accounts.forEach((account) => {
      if (account.status) {
        tmpCountData["Active"] = tmpCountData["Active"] + 1;
      } else {
        tmpCountData["InActive"] = tmpCountData["InActive"] + 1;
      }
    });

    const result = Object.keys(tmpCountData).map((key) => ({
      key,
      value: tmpCountData[key],
    }));
    res.status(200).json(result);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const searchAccountByEmail = asyncHandler(async (req, res, next) => {
  try {
    const searchEmail = req.query.searchEmail;
    if (!searchEmail || searchEmail === undefined) {
      res.status(400);
      throw new Error("Không được để trống thông tin yêu cầu");
    }
    let users = await User.find({
      email: { $regex: searchEmail, $options: "i" },
    });
    if (!users) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi tìm kiếm tài khoản theo email");
    }
    users = users.filter((user) => user.role !== RoleEnum.ADMIN);
    // Send the results as a JSON response to the client
    res.json(users);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const banAccountByAdmin = asyncHandler(async (req, res, next) => {
  try {
    const { account_id } = req.params;
    const user = await User.findById(account_id).exec();
    if (!user) {
      res.status(404);
      throw new Error("Không tìm thấy tài khoản!");
    }
    if (user.role === RoleEnum.ADMIN) {
      res.status(400);
      throw new Error("Không thể khóa tài khoản admin");
    }
    user.status = false;
    const result = await user.save();
    if (!result) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi khóa tài khoản");
    }
    res.status(200).json(result);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const filterAccount = asyncHandler(async (req, res) => {
  try {
    const { filterBy, filterType } = req.query;
    let accounts = await User.find();
    if (!accounts) {
      res.status(400);
      throw new Error("Có lỗi xảy ra khi lọc tài khoản");
    }
    if (accounts.length === 0) {
      res.status(200).json([]);
    }
    switch (filterBy) {
      case FilterByEnum.ROLE_NAME: {
        switch (filterType) {
          case RoleEnum.CUSTOMER: {
            accounts = accounts.filter(
              (account) => account.role === RoleEnum.CUSTOMER
            );
            res.status(200).json(accounts);
            break;
          }
          case RoleEnum.INVESTOR: {
            accounts = accounts.filter(
              (account) => account.role === RoleEnum.INVESTOR
            );
            res.status(200).json(accounts);
            break;
          }
          case RoleEnum.STAFF: {
            accounts = accounts.filter(
              (account) => account.role === RoleEnum.STAFF
            );
            res.status(200).json(accounts);
            break;
          }
          default: {
            res.status(400);
            throw new Error("Vai trò không phù hợp để lọc");
          }
        }
        break;
      }
      case FilterByEnum.GENDER: {
        switch (filterType) {
          case FilterTypeEnum.MALE: {
            accounts = accounts.filter(
              (account) => account.gender === FilterTypeEnum.MALE
            );
            res.status(200).json(accounts);
            break;
          }
          case FilterTypeEnum.FEMALE: {
            accounts = accounts.filter(
              (account) => account.gender === FilterTypeEnum.FEMALE
            );
            res.status(200).json(accounts);
            break;
          }
          case FilterTypeEnum.NOT_UPDATE: {
            accounts = accounts.filter((account) => !account.gender);
            res.status(200).json(accounts);
            break;
          }
          default: {
            res.status(400);
            throw new Error("Giới tính không phù hợp để lọc");
          }
        }
        break;
      }
      case FilterByEnum.STATUS: {
        switch (filterType) {
          case FilterTypeEnum.ACTIVE: {
            accounts = accounts.filter((account) => account.status);
            res.status(200).json(accounts);
            break;
          }
          case FilterTypeEnum.IN_ACTIVE: {
            accounts = accounts.filter((account) => !account.status);
            res.status(200).json(accounts);
            break;
          }
          default: {
            res.status(400);
            throw new Error("Giới tính không phù hợp để lọc");
          }
        }
        break;
      }
      default: {
        res.status(400);
        throw new Error(
          "Chỉ lọc theo vai trò, giới tính và trạng thái hoạt động"
        );
      }
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const sortAccount = asyncHandler(async (req, res) => {
  const { sortBy, sortType } = req.query;
  try {
    switch (sortBy) {
      case SortByEnum.CREATED_AT: {
        if (sortType === SortTypeEnum.ASC) {
          await User.find()
            .sort({ createdAt: 1 })
            .exec((err, users) => {
              if (err) {
                res.status(500);
                throw new Error(
                  "Có lỗi xảy ra khi truy xuất tất cả tài khoản theo ngày tạo"
                );
              }
              res.status(200).json(users);
            });
        } else if (sortType === SortTypeEnum.DESC) {
          await User.find()
            .sort({ createdAt: -1 })
            .exec((err, users) => {
              if (err) {
                res.status(500);
                throw new Error(
                  "Có lỗi xảy ra khi truy xuất tất cả tài khoản theo ngày tạo"
                );
              }
              res.status(200).json(users);
            });
        } else {
          res.status(400);
          throw new Error("Chỉ có thể tìm kiếm tăng dần hoặc giảm dần");
        }
        break;
      }
      case SortByEnum.EMAIL: {
        if (sortType === SortTypeEnum.ASC) {
          await User.find()
            .sort({ email: 1 })
            .exec((err, users) => {
              if (err) {
                res.status(500);
                throw new Error(
                  "Có lỗi xảy ra khi truy xuất tất cả tài khoản theo ngày tạo"
                );
              }
              res.status(200).json(users);
            });
        } else if (sortType === SortTypeEnum.DESC) {
          await User.find()
            .sort({ email: -1 })
            .exec((err, users) => {
              if (err) {
                res.status(500);
                throw new Error(
                  "Có lỗi xảy ra khi truy xuất tất cả tài khoản theo ngày tạo"
                );
              }
              res.status(200).json(users);
            });
        } else {
          res.status(400);
          throw new Error("Chỉ có thể tìm kiếm tăng dần hoặc giảm dần");
        }
        break;
      }
      case SortByEnum.FULL_NAME: {
        if (sortType === SortTypeEnum.ASC) {
          await User.find()
            .sort({ fullName: 1 })
            .exec((err, users) => {
              if (err) {
                res.status(500);
                throw new Error(
                  "Có lỗi xảy ra khi truy xuất tất cả tài khoản theo ngày tạo"
                );
              }
              res.status(200).json(users);
            });
        } else if (sortType === SortTypeEnum.DESC) {
          await User.find()
            .sort({ fullName: -1 })
            .exec((err, users) => {
              if (err) {
                res.status(500);
                throw new Error(
                  "Có lỗi xảy ra khi truy xuất tất cả tài khoản theo ngày tạo"
                );
              }
              res.status(200).json(users);
            });
        } else {
          res.status(400);
          throw new Error("Chỉ có thể tìm kiếm tăng dần hoặc giảm dần");
        }
        break;
      }
      default: {
        res.status(400);
        throw new Error("Chỉ sort theo tên, email và ngày tạo tài khoản");
      }
    }
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const statisticProfitByMonth = asyncHandler(async (req, res) => {
  try {
    const phases = await Phase.find().populate({
      path: "contract_id",
      populate: {
        path: "transaction_id",
        populate: { path: "timeshare_id" },
      },
    });
    const transactions = await Transaction.find().populate("timeshare_id");
    let result = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    if (transactions.length > 0) {
      transactions.forEach((transaction) => {
        if (
          transaction.timeshare_id.investor_id.toString() ===
            req.user.id.toString() &&
          transaction.reservation_pay_date !== undefined
        ) {
          const month = transaction.reservation_pay_date.getMonth();
          result[month] += transaction.reservation_price;
        }
      });
    }
    if (phases.length > 0) {
      phases.forEach((phase) => {
        if (
          phase.contract_id.transaction_id.timeshare_id.investor_id.toString() ===
            req.user.id.toString() &&
          phase.pay_date !== undefined
        ) {
          const month = phase.pay_date.getMonth();
          result[month] += phase.phase_price;
        }
      });
    }
    res.status(200).send(result);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  registerUser,
  registerStaff,
  getUsers,
  getStaffs,
  getUserById,
  getStaffById,
  updateStaff,
  updateUsers,
  deleteUsers,
  currentUser,
  checkOldPassword,
  changePassword,
  statisticsAccountByStatus,
  searchAccountByEmail,
  banAccountByAdmin,
  sortAccount,
  filterAccount,
  statisticProfitByMonth,
};
