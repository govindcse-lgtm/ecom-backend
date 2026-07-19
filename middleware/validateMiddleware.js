const { body, validationResult } = require("express-validator");

exports.validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is strictly required"),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid business email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Security constraint: Passwords must be 6+ characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

exports.validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid login email identifier"),
  body("password").notEmpty().withMessage("Password cannot be sent blank"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];
