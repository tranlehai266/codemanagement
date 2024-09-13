const { body, validationResult } = require("express-validator");

const validateCreateUser = [
  body("name")
    .isString()
    .withMessage("Tên phải là chuỗi")
    .notEmpty()
    .withMessage("Tên không được để trống"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }
    next();
  },
];

const validateCreateTask = [
  body("name")
    .isString()
    .withMessage("Tên nhiệm vụ phải là chuỗi")
    .notEmpty()
    .withMessage("Tên nhiệm vụ không được để trống"),
  body("description")
    .isString()
    .withMessage("Mô tả phải là chuỗi")
    .notEmpty()
    .withMessage("Mô tả không được để trống"),
  body("status")
    .optional()
    .isIn(["pending", "working", "review", "done", "archive"])
    .withMessage("Trạng thái không hợp lệ"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }
    next();
  },
];

module.exports = { validateCreateUser, validateCreateTask };
