const mongoose = require("mongoose");

const userSchema =  mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      required: true,
      default: "employee",
      enum: ["manager", "employee"],
    },
    task: { type: [mongoose.SchemaTypes.ObjectId], ref: "Task", default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
