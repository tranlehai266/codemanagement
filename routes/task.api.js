const express = require("express");
const router = express.Router();
const {
  createTask,
  getTask,
  getSingleTask,
  assignedTask,
  deleteTask,
  updateStatus,
} = require("../controllers/task.controller");

router.post("/", createTask);
router.get("/", getTask);
router.get("/:id", getSingleTask);
router.put("/assign", assignedTask)
router.put("/:id",updateStatus)
router.delete("/:id", deleteTask)
module.exports = router;
