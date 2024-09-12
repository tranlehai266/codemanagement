const express = require("express")
const router = express.Router()
const { createTask, getTask } = require("../controllers/task.controller")

router.post("/" , createTask)
router.get("/", getTask)
module.exports = router