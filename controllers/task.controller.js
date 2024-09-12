const mongoose = require("mongoose");
const Task = require("../model/Task");
const { sendResponse, AppError } = require("../helpers/utils");

const taskController = {};

taskController.createTask = async (req, res, next) => {
  try {
    const info = req.body;
    if (!info) throw new AppError(400, "Bad Request", "Create Task Error");
    const newTask = await Task.create(info);

    sendResponse(
      res,
      200,
      true,
      { task: newTask },
      null,
      "Created Task Success"
    );
  } catch (error) {
    next(error);
  }
};
taskController.getTask = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    sendResponse(
      res,
      200,
      true,
      { data: tasks },
      null,
      "Get all tasks success"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = taskController;
