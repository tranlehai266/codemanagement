const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  searchNameUser,
  getAllTaskUser,
} = require("../controllers/user.controller");

router.post("/", createUser);
router.get("/", getUsers);
router.get("/search", searchNameUser);
router.get("/tasks/:id",getAllTaskUser)
module.exports = router;
