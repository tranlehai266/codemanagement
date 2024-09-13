const mongoose = require("mongoose");
const User = require("../model/User");
const { sendResponse, AppError } = require("../helpers/utils");

const userController = {};

userController.createUser = async (req, res, next) => {
  try {
    const info = req.body;
    if (!info) throw new AppError(400, "Bad Request", "Create User Error");
    const userDuplicate = await User.findOne({ name: info.name });
    if (userDuplicate) {
      throw new AppError(400, "Bad Request", "User is has already");
    }
    const created = await User.create(info);

    sendResponse(
      res,
      200,
      true,
      { user: created },
      null,
      "Created User Success"
    );
  } catch (error) {
    next(error);
  }
};

userController.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isDeleted: false }).populate("task");
    sendResponse(
      res,
      200,
      true,
      { data: users },
      null,
      "Get all users success"
    );
  } catch (error) {
    next(error);
  }
};

userController.searchNameUser = async (req, res, next) => {
  try {
    const userName = req.query.name;
    const userRole = req.query.role;
    if (!userName)
      throw new AppError(
        404,
        "Bad Request",
        "Please type your user name want search"
      );
    const searchRole = await User.findOne({
      role: { $regex: userRole || "employee", $options: "i" },
    });
    if (!searchRole) {
      throw new AppError(
        404,
        "Not Found",
        "No users with the specified role found"
      );
    }
    const searchUser = await User.findOne({
      name: { $regex: userName, $options: "i" }, // Tìm kiếm không phân biệt hoa thường
    });
    if (searchUser.length === 0)
      throw new AppError(404, "Not Found", "No users match the search");
    sendResponse(res, 200, true, searchUser, null, "Search Success");
  } catch (error) {
    next(error);
  }
};

userController.getAllTaskUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError(400, "Bad Request", "Invalid User ID");
    }
    const user = await User.findById(userId).populate("task");
    if (!user) {
      throw new AppError(404, "Not Found", "User not found");
    }
    sendResponse(res, 200, true, user, null, "Find Task of User");
  } catch (error) {
    next(error);
  }
};
module.exports = userController;
