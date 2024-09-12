const mongoose = require("mongoose");
const User = require("../model/User");
const { sendResponse, AppError } = require("../helpers/utils");

const userController = {};

userController.createUser = async (req, res, next) => {
  try {
    const info = req.body;
    if (!info) throw new AppError(400, "Bad Request", "Create User Error");
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
    const users = await User.find();
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
    if (!userName)
      throw new AppError(
        404,
        "Bad Request",
        "Please type your user name want search"
      );
    const searchUser = await User.find({
      name: { $regex: userName, $options: "i" }, // tìm kiếm không phân biệt hoa thường
    });
    if (!searchUser.length)
      throw new AppError(404, "Not Found", "No users match the search");
    sendResponse(res, 200, true, searchUser, null, "Search Success");
  } catch (error) {
    next(error);
  }
};
userController.getAllTaskUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("task");
    sendResponse(res, 200, true, user, null, "Find Task of User");
  } catch (error) {
    next(error);
  }
};
module.exports = userController;
