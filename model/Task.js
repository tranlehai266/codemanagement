const mongoose = require("mongoose");
const taskSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "working", "review", "done", "archive"],
      default: "pending",
    },
    assignedTo: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      default: null,
    },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
