const mongoose = require("mongoose");
const Task = require("../model/Task");
const User = require("../model/User");
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
    const tasks = await Task.find({ isDeleted: false }).populate("assignedTo");
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
taskController.getSingleTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new AppError(400, "Invalid ID", "Task ID is invalid");
    }
    const singleTask = await Task.findById(taskId);
    if (!singleTask) throw new AppError(404, "Not Found", "Task not found");
    sendResponse(res, 200, true, singleTask, null, "Get Single Task Success");
  } catch (error) {
    next(error);
  }
};
taskController.assignedTask = async (req, res, next) => {
  const _id = req.body.userId;
  const taskId = req.body.taskId;

  try {
    const user = await User.findById(_id);
    if (!user) {
      throw new AppError(401, "Bad Request", "Cannot Find User");
    }

    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError(404, "Not Found", "Task not found");
    }

    if (user.task.includes(taskId)) {
      throw new AppError(
        400,
        "Bad Request",
        "Task already assigned to this user"
      );
    }

    const updateUser = await User.findByIdAndUpdate(
      _id,
      { $addToSet: { task: taskId } },
      { new: true }
    );

    const updateTask = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: _id },
      { new: true }
    );

    sendResponse(
      res,
      200,
      true,
      { user: updateUser, task: updateTask },
      null,
      "Assigned Task Successfully"
    );
  } catch (error) {
    next(error);
  }
};

taskController.updateStatus = async (req, res, next) => {
  const taskId = req.params.id;
  const taskStatus = req.body;
  const options = { new: true };

  try {
    // Kiểm tra tính hợp lệ của taskId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new AppError(420, "Bad Request", "Invalid ID");
    }

    // tìm task theo ID
    const checking = await Task.findById(taskId);
    if (!checking) {
      throw new AppError(404, "Not Found", "Task not found");
    }

    // Kiểm tra điều kiện cập nhật trạng thái
    if (checking.status === "done" && taskStatus.status !== "archive") {
      throw new AppError(
        402,
        "Bad Request",
        "Cannot update status when it's done"
      );
    }
    if (checking.status === "archive") {
      throw new AppError(402, "Bad Request", "This is archive");
    }

    // Cập nhật trạng thái của nhiệm vụ
    const updateStatus = await Task.findByIdAndUpdate(
      taskId,
      taskStatus,
      options
    );

    sendResponse(
      res,
      200,
      true,
      { task: updateStatus },
      null,
      "Update Task Status Successfully!"
    );
  } catch (error) {
    next(error);
  }
};
taskController.deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new AppError(400, "Bad Request", "Task ID Invalid");
    }
    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError(404, "Not Found", "Task not found");
    }
    const updateUser = await User.updateMany(
      { task: taskId },
      { $pull: { task: taskId } }
    );

    if (updateUser.length === 0){
      throw new AppError(404, "Not Found", "No Update User ");
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { isDeleted: true },
      { new: true }
    );
    // từ id đó tìm user có cái id của task đó

    sendResponse(
      res,
      200,
      true,
      updatedTask,
      null,
      "Deleted Task Success (Soft Delete)"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = taskController;
